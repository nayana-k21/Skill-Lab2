/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HumanSupportModal } from './components/HumanSupportModal';
import { WorkspaceLayout } from './components/Layout';
import { AppProvider } from './context/AppContext';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { CasesPage } from './pages/CasesPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { LandingPage } from './pages/LandingPage';
import { PrivacyEthicsPage } from './pages/PrivacyEthicsPage';
import { ReferralsPage } from './pages/ReferralsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <HumanSupportModal />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<WorkspaceLayout />}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/cases/:id" element={<CaseDetailPage />} />
            <Route path="/referrals" element={<ReferralsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/privacy" element={<PrivacyEthicsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
