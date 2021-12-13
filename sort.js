import { error } from 'console';
import fs from 'fs/promises';
import path from 'path';

class SortFiles {
  #dist;
  constructor(dist) {
    this.#dist = dist;
  }
  DIST = 'dist';
  async #copyFile(file) {
    const nameTargetDir = path.extname(file.name); //.jpg название папки исходя из расширения файла
    const targetDir = path.join(this.#dist, nameTargetDir); // кладём в папку ДИСТ, .dist/.jpg
    try {
      await fs.mkdir(targetDir, { recursive: true }); // создаём директорию, если есть не нужно создавать
      await fs.copyFile(file.path, path.join(targetDir, file.name)); // и копируем туда файлы
    } catch {
      console.error(error);
      process.exit(1);
    }
  }

  // рекурсивная функция, читаем папку picture
  async readFolder(base) {
    const files = await fs.readdir(base);
    for (const item of files) {
      const localBase = path.join(base, item);
      const state = await fs.stat(localBase); // определяет что за тип файлов
      if (state.isFile()) {
        //передаем имя файла и путь к нему
        await this.#copyFile({ name: item, path: localBase }); // если файли вызываем функцию copyFile, условие выхода из рекурсии
        console.log(localBase);
      } else {
        await this.readFolder(localBase); // если папка рекурсивно вызываем сами себя, проваливание в рекурсию
      }
    }
  }
}

export default SortFiles;
