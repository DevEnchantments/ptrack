import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/AppLayout'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { CreateProjectWizard } from '@/pages/CreateProjectWizard'
import { ActionItemDetailPage } from '@/pages/ActionItemDetailPage'
import { MilestoneDetailPage } from '@/pages/MilestoneDetailPage'
import { StatusReportDetailPage } from '@/pages/StatusReportDetailPage'
import { AttachmentDetailPage } from '@/pages/AttachmentDetailPage'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <>
      <Toaster />
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/new" element={<CreateProjectWizard />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route
            path="/projects/:projectId/action-items/:actionItemId"
            element={<ActionItemDetailPage />}
          />
          <Route
            path="/projects/:projectId/milestones/:milestoneId"
            element={<MilestoneDetailPage />}
          />
          <Route
            path="/projects/:projectId/status-reports/:statusReportId"
            element={<StatusReportDetailPage />}
          />
          <Route
            path="/projects/:projectId/attachments/:attachmentId"
            element={<AttachmentDetailPage />}
          />
        </Route>
      </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App