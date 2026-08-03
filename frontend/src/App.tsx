import { lazy, Suspense } from 'react'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/AppLayout'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from '@/components/ui/toaster'

// Login and Home are the first paint for every session, so they stay in the
// entry chunk. Everything past them splits out: the dashboard drags in nine
// hand-rolled charts and the project page ten dialogs, and most sessions
// touch neither.
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const ProjectDetailPage = lazy(() =>
  import('@/pages/ProjectDetailPage').then((m) => ({
    default: m.ProjectDetailPage,
  })),
)
const CreateProjectWizard = lazy(() =>
  import('@/pages/CreateProjectWizard').then((m) => ({
    default: m.CreateProjectWizard,
  })),
)
const ActionItemDetailPage = lazy(() =>
  import('@/pages/ActionItemDetailPage').then((m) => ({
    default: m.ActionItemDetailPage,
  })),
)
const MilestoneDetailPage = lazy(() =>
  import('@/pages/MilestoneDetailPage').then((m) => ({
    default: m.MilestoneDetailPage,
  })),
)
const StatusReportDetailPage = lazy(() =>
  import('@/pages/StatusReportDetailPage').then((m) => ({
    default: m.StatusReportDetailPage,
  })),
)
const AttachmentDetailPage = lazy(() =>
  import('@/pages/AttachmentDetailPage').then((m) => ({
    default: m.AttachmentDetailPage,
  })),
)

/**
 * Shown only while a route chunk is in flight. Mirrors the page shell (header
 * strip + content block) rather than a spinner, so the swap to real content is
 * not a jump from centred spinner to top-aligned page.
 */
function RouteFallback() {
  return (
    <div className="min-h-svh">
      <header className="border-b px-6 py-4">
        <Skeleton className="h-4 w-40" />
      </header>
      <div className="mx-auto max-w-5xl p-6">
        <Skeleton className="mb-6 h-8 w-64" />
        <div className="flex flex-col gap-3 rounded-md border p-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/projects/new"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <CreateProjectWizard />
                </Suspense>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <ProjectDetailPage />
                </Suspense>
              }
            />
            <Route
              path="/projects/:projectId/action-items/:actionItemId"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <ActionItemDetailPage />
                </Suspense>
              }
            />
            <Route
              path="/projects/:projectId/milestones/:milestoneId"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <MilestoneDetailPage />
                </Suspense>
              }
            />
            <Route
              path="/projects/:projectId/status-reports/:statusReportId"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <StatusReportDetailPage />
                </Suspense>
              }
            />
            <Route
              path="/projects/:projectId/attachments/:attachmentId"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <AttachmentDetailPage />
                </Suspense>
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
