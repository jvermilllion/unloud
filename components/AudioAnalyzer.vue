<template>
  <div class="bg-paper-light dark:bg-paper-dark border border-ink-light dark:border-ink-dark p-4 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold mb-4">Audio Analysis</h3>
    <div v-if="analyzing" class="text-ink-light dark:text-ink-dark">Analyzing audio...</div>
    <div v-else-if="analyzed">
      <p class="mb-2"><strong>Peak amplitude:</strong> {{ peakAmplitude.toFixed(2) }} dB</p>
      <p class="mb-2"><strong>Dynamic range:</strong> {{ dynamicRange.toFixed(2) }} dB</p>
      <p class="mb-4"><strong>Perceived loudness:</strong> {{ perceivedLoudness.toFixed(2) }} LUFS</p>
      <button @click="applyEnhancements" class="bg-action-light dark:bg-action-dark text-paper-light dark:text-paper-dark px-4 py-2 rounded hover:opacity-80">
        Apply Enhancements
      </button>
    </div>
    <div v-else class="text-ink-light dark:text-ink-dark">No audio analyzed yet.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  audioUrl: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['enhanced']);

const analyzing = ref(false);
const analyzed = ref(false);
const peakAmplitude = ref(0);
const dynamicRange = ref(0);
const perceivedLoudness = ref(0);

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

onMounted(() => {
  analyzeAudio();
});

const analyzeAudio = async () => {
  analyzing.value = true;
  try {
    const response = await fetch(props.audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0);
    const bufferLength = channelData.length;

    let max = 0;
    let min = 0;
    let sum = 0;

    for (let i = 0; i < bufferLength; i++) {
      const sample = channelData[i];
      if (sample > max) max = sample;
      if (sample < min) min = sample;
      sum += Math.abs(sample);
    }

    peakAmplitude.value = 20 * Math.log10(max);
    dynamicRange.value = 20 * Math.log10(max / (sum / bufferLength));
    perceivedLoudness.value = -0.691 + 10 * Math.log10(sum / bufferLength);

    analyzed.value = true;
  } catch (error) {
    console.error('Error analyzing audio:', error);
  } finally {
    analyzing.value = false;
  }
};

const applyEnhancements = async () => {
  try {
    const response = await fetch(props.audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const enhancedBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const enhancedChannelData = enhancedBuffer.getChannelData(channel);

      for (let i = 0; i < channelData.length; i++) {
        // Apply a simple enhancement: soft clipping and slight boost
        enhancedChannelData[i] = Math.tanh(channelData[i] * 1.2) * 0.9;
      }
    }

    const blob = bufferToWave(enhancedBuffer, enhancedBuffer.length);
    const enhancedUrl = URL.createObjectURL(blob);

    emit('enhanced', enhancedUrl);
  } catch (error) {
    console.error('Error enhancing audio:', error);
  }
};

// Helper function to convert AudioBuffer to WAV Blob
const bufferToWave = (abuffer, len) => {
  const numOfChan = abuffer.numberOfChannels;
  const length = len * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels = [];
  let sample;
  let offset = 0;
  let pos = 0;

  // write WAVE header
  setUint32(0x46464952);
  setUint32(length - 8);
  setUint32(0x45564157);
  setUint32(0x20746d66);
  setUint32(16);
  setUint16(1);
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2);
  setUint16(16);
  setUint32(0x61746164);
  setUint32(length - pos - 4);

  for (let i = 0; i < abuffer.numberOfChannels; i++) {
    channels.push(abuffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([buffer], { type: 'audio/wav' });

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
};
</script>