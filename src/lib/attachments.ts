export const attachmentLimits = { count: 5, bytes: 10 * 1024 * 1024 };
export const fileTypes: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  txt: "text/plain",
  csv: "text/csv",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  zip: "application/zip",
  dwg: "application/octet-stream",
  dxf: "application/octet-stream",
};
export const fileAccept = Object.keys(fileTypes)
  .map((x) => `.${x}`)
  .join(",");
export type Attachment = {
  path: string;
  name: string;
  size: number;
  type: string;
};
export function attachmentError(
  files: readonly Pick<File, "name" | "size">[],
  lang: "ar" | "en",
) {
  if (files.length > attachmentLimits.count)
    return lang === "ar"
      ? "يمكن إرفاق 5 ملفات كحد أقصى."
      : "Attach up to 5 files.";
  for (const f of files) {
    if (!Object.hasOwn(fileTypes, f.name.split(".").pop()!.toLowerCase()))
      return lang === "ar"
        ? "نوع الملف غير مدعوم. اختر من الأنواع الموضحة."
        : "Unsupported file type. Choose one of the listed formats.";
    if (f.size < 1 || f.size > attachmentLimits.bytes || f.name.length > 200)
      return lang === "ar"
        ? "يجب ألا يكون الملف فارغًا أو أكبر من 10 ميجابايت، واسمه لا يتجاوز 200 حرف."
        : "Files must be non-empty, at most 10 MB, with names up to 200 characters.";
  }
  return "";
}
export function attachmentManifest(files: File[], id: string): Attachment[] {
  return files.map((file) => {
    const ext = file.name.split(".").pop()!.toLowerCase();
    return {
      path: `${id}/${crypto.randomUUID()}.${ext}`,
      name: file.name,
      size: file.size,
      type: fileTypes[ext],
    };
  });
}
