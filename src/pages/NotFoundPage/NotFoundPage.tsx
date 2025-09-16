import s from './NotFound.module.scss'
import { Link } from 'react-router-dom'

export const NotFoundPage = () => {

  return (
    <div className={s.notFound}>
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/">Home</Link>
    </div>
  )
}
