import { Request, Response } from 'express'

class SettingsController {

  public account = async(req: Request, res: Response): Promise<void> => {
    res.status(201).json({ user: req.user })
    return
  }
}

export default new SettingsController