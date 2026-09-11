# المساهمة / Contributing

أنشئ فرعًا، وحافظ على العربية والإنجليزية وRTL والوصول بلوحة المفاتيح. حدّث الأسعار من `src/config/site.ts` فقط. لا تضف أسرارًا أو بيانات عملاء أو معلومات شخصية إلى Git. شغّل `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build` ثم افتح Pull Request يشرح التغيير والتحقق.

Create a branch, preserve Arabic/English, RTL and keyboard accessibility, update prices in the shared configuration, and never commit secrets or customer data. Run the checks above and submit a focused pull request with validation details. Database changes must preserve RLS and include allow/deny tests.
