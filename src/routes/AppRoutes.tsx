import { Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';
import { SchedulePage } from '../pages/SchedulePage/SchedulePage';
import { Header } from '../components/Header/Header';
import { CoachesListPage } from '../pages/CoachesPage/CoachesPage';
import { CoachPage } from '../pages/SingleCoachPage/SingleCoachPage';
import { ContactsPage } from '../pages/ContactsPage/ContactsPage';
import { PartnersPage } from '../pages/PartnersPage/PartnersPage';
import { PartnerEditPage } from '../pages/PartnersEditPage/PartnersEditPage';
import { DonationsPage } from '../pages/DonationsPage/DonationsPage';

import { ProgramEditPage } from '../pages/ProgramEditPage/ProgramEditPage';
import { ProgramsPage } from '../pages/ProgramsPadge/ProgramsPage';




export const AppRoutes = () => {

    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/coaches" element={<CoachesListPage />} />
                    <Route path="/coaches/:id" element={<CoachPage />} />
                    <Route path="/coaches/new" element={<CoachPage isNew />} />
                    <Route path="/contacts" element={<ContactsPage />} />
                    <Route path="/partners" element={<PartnersPage />} />
                    <Route path="/partners/:id" element={<PartnerEditPage />} />
                          <Route path="/programs" element={<ProgramsPage />} />
                    <Route path="/programs/:id" element={<ProgramEditPage />} />
                    <Route path="/donations" element={<DonationsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes></>
    );
};
