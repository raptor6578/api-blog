import fs from 'fs'

export class imageService {

  public async moveTempTo(fileNames: string[], newPath: string) {
    for (const fileName of fileNames) {
      fs.renameSync(`images/temp/${fileName}`, `images/${newPath}/${fileName}`)
    }
  }

}

export default new imageService()