import * as fs from 'fs';

export const removeUnusedFile = async (filePath: string = '') => {
  if (!filePath) return;

  const fileExists = fs.existsSync(filePath);
  if (!fileExists) return;

  await fs.promises.rm(filePath);
};
