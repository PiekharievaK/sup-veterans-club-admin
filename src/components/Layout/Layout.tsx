import { Outlet } from 'react-router-dom'
import s from './Layout.module.scss'
import { SideBar } from '../SideBar/SideBar'

export const Layout = () => {

  return (
    <div className={s.layout}>
      <main className={s.main}>
        <SideBar />
        <div className={s.workspace}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
