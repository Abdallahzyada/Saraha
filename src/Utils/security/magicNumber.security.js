import { fileTypeFromBuffer } from "file-type";

export const validateMagicNumber = async (buffer, allowedType = []) => {
  const type = await fileTypeFromBuffer(buffer);
  if (!type) return false;

  return allowedType.includes(type.mime);
};
