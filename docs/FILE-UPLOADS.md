# مرفقات الطلب / Request attachments

Clients can attach up to 5 files, each non-empty and at most 10 MiB. Accepted formats: PDF, DOC/DOCX, PPT/PPTX, XLS/XLSX, TXT, CSV, PNG/JPG, ZIP, DWG/DXF. A file link is still optional.

يمكن رفع الملفات مباشرة عند الضغط على إرسال وحفظ الطلب. الملفات خاصة وتظهر للإدارة داخل تفاصيل الطلب، مع زر تنزيل لكل ملف. واتساب والبريد لا يرفقان الملفات تلقائيًا.

## Storage and authorization

The private `request-files` bucket in the existing Nexora Supabase project enforces 10 MiB per object and MIME restrictions. The order stores a maximum-five attachment manifest. Each file path contains the order UUID and a separate random UUID; original names are metadata, never public URLs. Guests can INSERT only an exact path registered on a saved order within 24 hours. They cannot list, read, sign, overwrite or delete files. Admin membership is checked in the Storage SELECT policy; downloads use the authenticated SDK and a short-lived browser blob URL, not public links.

The narrowly scoped `nexora_private.can_upload_attachment` function is SECURITY DEFINER because guests cannot SELECT orders. It is outside exposed API schemas, uses an empty search_path and returns only a boolean. It authorizes via the unguessable per-file capability rather than auth.uid(), since request clients do not need accounts. Do not expose this schema through PostgREST. Manifest paths are confidential with the rest of the order.

## Partial failure and operations

Order is saved first, then files upload sequentially. Success is shown only after all selected uploads complete. Interrupted uploads show the saved reference and retry button; the same immutable order/path is reused without duplicate orders. Keep the page open to retry. Refreshing loses the in-memory files; the saved order remains visible to admins. A missing file produces an honest admin download error. Contact the client to obtain missing files if the page was closed. Uploaded files cannot be altered by the client.

Limits exist in `src/lib/attachments.ts` and the database migration/bucket. Change both together. MIME and extension checks are not malware scanning; there is no antivirus service. Downloaded client content must be treated as untrusted. Public submissions have no CAPTCHA or per-client rate limiter; monitor storage and submission usage before heavy promotion. Do not increase bucket limits without reviewing the free-plan storage allowance.

Operator deletion must remove objects through the Supabase Storage API, then delete the related order according to the documented retention policy. Never delete storage.objects directly through SQL. No temporary public links or service-role keys are stored in the frontend.

## Verification

Playwright exercises client upload, simulated network interruption, retry without duplicate orders, admin download with byte-for-byte comparison, and denied guest downloads/signing/listing/overwrite/unregistered uploads. Test fixtures are removed using the operator Storage API after each test.
