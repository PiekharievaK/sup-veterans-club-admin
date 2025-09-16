import { Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';
import { SchedulePage } from '../pages/SchedulePage/SchedulePage';
import { Header } from '../components/Header/Header';



export const AppRoutes = () => {

    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes></>
    );
};
