CREATE OR REPLACE FUNCTION get_size_of_tables()
RETURNS TABLE (schema text, size bigint) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT schemaname::text, sum(pg_total_relation_size(quote_ident(schemaname) || '.' || quote_ident(tablename)))::bigint
  FROM pg_tables
  GROUP BY schemaname;
END;
$$;