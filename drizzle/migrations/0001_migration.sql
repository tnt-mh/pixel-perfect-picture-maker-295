create policy "own driver docs read" on storage.objects for select to authenticated
  using (bucket_id = 'driver-documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.has_role(auth.uid(),'admin')));
create policy "own driver docs upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'driver-documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own driver docs update" on storage.objects for update to authenticated
  using (bucket_id = 'driver-documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own driver docs delete" on storage.objects for delete to authenticated
  using (bucket_id = 'driver-documents' and (storage.foldername(name))[1] = auth.uid()::text);