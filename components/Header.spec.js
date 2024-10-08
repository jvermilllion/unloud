import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Header from './Header.vue'

describe('Header', () => {
  it('renders correctly when user is not logged in', () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [createTestingPinia({ createSpy: jest.fn })],
        stubs: ['NuxtLink']
      }
    })

    expect(wrapper.text()).toContain('Login')
    expect(wrapper.text()).toContain('Register')
    expect(wrapper.text()).not.toContain('Logout')
  })

  it('renders correctly when user is logged in', () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [createTestingPinia({
          createSpy: jest.fn,
          initialState: {
            user: { user: { id: '1', email: 'test@example.com' } }
          }
        })],
        stubs: ['NuxtLink']
      }
    })

    expect(wrapper.text()).not.toContain('Login')
    expect(wrapper.text()).not.toContain('Register')
    expect(wrapper.text()).toContain('Logout')
  })
})