import { Request, Response, NextFunction } from 'express'
import { pick } from 'lodash'
type FilterKey<T> = Array<keyof T>
export const fillterMiddleware = <T>(fillterKeys: FilterKey<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, fillterKeys)
    next()
  }
}
