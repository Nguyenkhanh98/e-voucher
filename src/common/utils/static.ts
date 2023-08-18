import * as fs from 'fs';
import * as path from 'path';

const STATIC_DIR = 'src/statics';

export function loadStatic(fileName: string) {
  const projectDir = path.resolve('./');
  const filePath = path.join(projectDir, `${STATIC_DIR}/${fileName}`);
  return fs.readFileSync(filePath, 'utf8');
}
