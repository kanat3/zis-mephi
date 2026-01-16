import { useState, useEffect } from 'react';
import {
  HelpCircle, PlayCircle, FileText, BarChart3,
  Rocket, FolderOpen, ClipboardList, Undo2, Plus, Edit, Trash2,
  LogOut, User, Archive, Upload, Search, Download, X, AlertCircle, CheckCircle, Link, Settings
} from 'lucide-react';
import { apiClient, TokenManager } from '../services/api.ts';
import type { User as UserType, Project, Requirement, TestCase, TestPlan, TestSuite, TestReport } from '../services/api.ts';
import {
  safeNumber,
  safeString,
  safeArray,
  safeDate,
  formatNumber,
  safeCount,
  safeGet
} from './utils/dataHelpers.ts';

interface MainPageProps {
  onLogout: () => void;
}

export function MainPage({ onLogout }: MainPageProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'archived-projects' | 'requirements' | 'reports' | 'testing' | 'profile' | 'settings'>('dashboard');
  const [selectedPlan, setSelectedPlan] = useState('integration');
  const [showHelp, setShowHelp] = useState(false);
  const [notification, setNotification] = useState('');
  const [history, setHistory] = useState<string[]>(['dashboard']);
  const [errorModal, setErrorModal] = useState<{ show: boolean; message: string; type: 'error' | 'success' }>({ show: false, message: '', type: 'error' });
  const [selectedTestSuite, setSelectedTestSuite] = useState('');
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [requirementsData, setRequirementsData] = useState<Requirement[]>([]);
  const [testCasesData, setTestCasesData] = useState<TestCase[]>([]);
  const [testSuitesData, setTestSuitesData] = useState<TestSuite[]>([]);
  const [testPlansData, setTestPlansData] = useState<TestPlan[]>([]);
  const [testReportsData, setTestReportsData] = useState<TestReport[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(TokenManager.getUser());
  const [loading, setLoading] = useState(true);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
  };

  const showError = (message: string, type: 'error' | 'success' = 'error') => {
    setErrorModal({ show: true, message, type });
  };

  const navigateTo = (tab: typeof activeTab) => {
    setHistory([...history, activeTab]);
    setActiveTab(tab);
  };

  const goBack = () => {
    if (history?.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousTab = newHistory[newHistory.length - 1] as typeof activeTab;
      setHistory(newHistory);
      setActiveTab(previousTab);
    }
  };

  const handleLogout = () => {
    setTimeout(() => {
      onLogout();
    }, 1500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [projects, requirements, testPlans, testSuites, reports] = await Promise.all([
        apiClient.getProjects(),
        apiClient.getRequirements(),
        apiClient.getTestPlans(),
        apiClient.getTestSuites(),
        apiClient.getTestReports()
      ]);

      setProjectsData(safeArray<Project>(projects));
      setRequirementsData(safeArray<Requirement>(requirements));
      setTestPlansData(safeArray<TestPlan>(testPlans));
      setTestSuitesData(safeArray<TestSuite>(testSuites));
      setTestReportsData(safeArray<TestReport>(reports));

      // Load test cases for all projects
      if (projects?.length > 0) {
        const allTestCases: TestCase[] = [];
        for (const project of projects) {
          try {
            const testCases = await apiClient.getTestCases(project.id);
            allTestCases.push(...testCases);
          } catch (err) {
            console.error(`Failed to load test cases for project ${project.id}:`, err);
          }
        }
        setTestCasesData(allTestCases);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      showError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setShowHelp(true);
        showNotification('Открыта справка (F1)');
      }
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        showNotification('Запуск тестов (Ctrl+Enter)');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-[#f19fb5] text-xl">Загрузка данных...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      <div className="w-64 bg-white border-r border-[#e8e9ea] flex flex-col">
        <div className="p-4 border-b border-[#e8e9ea]">
          <h1 className="text-xl text-[#f19fb5]">СУТ Система</h1>
          <p className="text-xs text-[#6c757d] mt-1">{currentUser.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigateTo('dashboard')}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-[#ffe9f0] text-[#f19fb5]'
                : 'text-[#2b2f33] hover:bg-[#ffe9f0] hover:text-[#f19fb5]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Главная панель
          </button>
          <button
            onClick={() => navigateTo('projects')}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-[#ffe9f0] text-[#f19fb5]'
                : 'text-[#2b2f33] hover:bg-[#ffe9f0] hover:text-[#f19fb5]'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Проекты
          </button>
          <button
            onClick={() => navigateTo('archived-projects')}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'archived-projects'
                ? 'bg-[#ffe9f0] text-[#f19fb5]'
                : 'text-[#2b2f33] hover:bg-[#ffe9f0] hover:text-[#f19fb5]'
            }`}
          >
            <Archive className="w-4 h-4" />
            Архивные проекты
          </button>
          <button
            onClick={() => navigateTo('requirements')}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'requirements'
                ? 'bg-[#ffe9f0] text-[#f19fb5]'
                : 'text-[#2b2f33] hover:bg-[#ffe9f0] hover:text-[#f19fb5]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Требования
          </button>
          <button
            onClick={() => navigateTo('testing')}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'testing'
                ? 'bg-[#ffe9f0] text-[#f19fb5]'
                : 'text-[#2b2f33] hover:bg-[#ffe9f0] hover:text-[#f19fb5]'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            Тестирование
          </button>
          <button
            onClick={() => navigateTo('reports')}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-[#ffe9f0] text-[#f19fb5]'
                : 'text-[#2b2f33] hover:bg-[#ffe9f0] hover:text-[#f19fb5]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Отчеты
          </button>
          <button
            onClick={() => navigateTo('profile')}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#ffe9f0] text-[#f19fb5]'
                : 'text-[#2b2f33] hover:bg-[#ffe9f0] hover:text-[#f19fb5]'
            }`}
          >
            <User className="w-4 h-4" />
            Профиль
          </button>
        </nav>

        <div className="p-4 border-t border-[#e8e9ea]">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => navigateTo('settings')}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 mb-2 ${
                activeTab === 'settings'
                  ? 'bg-[#ffe9f0] text-[#f19fb5]'
                  : 'text-[#2b2f33] hover:bg-[#ffe9f0] hover:text-[#f19fb5]'
              }`}
            >
              <Settings className="w-4 h-4" />
              Настройки системы
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 text-[#2b2f33] hover:bg-[#ffd7db] hover:text-[#b12e4a]"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
          <div className="mt-3 text-sm text-[#6c757d] px-3">
            Версия BETA
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'dashboard' && <DashboardView projectsData={projectsData} testCasesData={testCasesData} />}
        {activeTab === 'projects' && (
          <ProjectsView
            currentUser={currentUser}
            projectsData={projectsData}
            setProjectsData={setProjectsData}
            requirementsData={requirementsData}
            testCasesData={testCasesData}
            setTestCasesData={setTestCasesData}
            testSuitesData={testSuitesData}
            setTestSuitesData={setTestSuitesData}
            testPlansData={testPlansData}
            setTestPlansData={setTestPlansData}
            showError={showError}
            reloadData={loadData}
          />
        )}
        {activeTab === 'archived-projects' && (
          <ArchivedProjectsView
            projectsData={projectsData}
            setProjectsData={setProjectsData}
            showError={showError}
            reloadData={loadData}
          />
        )}
        {activeTab === 'requirements' && <RequirementsView requirementsData={requirementsData} setRequirementsData={setRequirementsData} showError={showError} />}
        {activeTab === 'reports' && <ReportsView showError={showError} testReportsData={testReportsData} projectsData={projectsData} testPlansData={testPlansData} testSuitesData={testSuitesData}  reloadData={loadData}/>}
        {activeTab === 'testing' && (
          <TestingView
            projectsData={projectsData}
            testPlansData={testPlansData}
            testSuitesData={testSuitesData}
            testCasesData={testCasesData}
            handleRunTests={async (projectId: number, testPlanId: number, testSuiteId: number) => {
              try {
                showError('Запуск тестов...', 'success');
                const result = await apiClient.runTests({
                  project_id: projectId,
                  test_plan_id: testPlanId,
                  test_suite_id: testSuiteId
                });
                await loadData();
              } catch (error) {
                console.error('Failed to run tests:', error);
              }
            }}
            showError={showError}
          />
        )}
        {activeTab === 'profile' && <ProfileView currentUser={currentUser} />}
        {activeTab === 'settings' && <SystemSettingsView currentUser={currentUser} showError={showError} />}
      </div>

      {/* Error/Success Modal */}
      {errorModal.show && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setErrorModal({ ...errorModal, show: false })}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              {errorModal.type === 'error' ? (
                <AlertCircle className="w-6 h-6 text-[#b12e4a]" />
              ) : (
                <CheckCircle className="w-6 h-6 text-[#28a745]" />
              )}
              <h2 className="text-xl text-[#f19fb5]">
                {errorModal.type === 'error' ? 'Ошибка' : 'Успешно'}
              </h2>
            </div>
            <p className="mb-6 text-[#2b2f33]">{errorModal.message}</p>
            <button
              onClick={() => setErrorModal({ ...errorModal, show: false })}
              className="w-full px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[600px] w-[90%] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl mb-6 text-[#f19fb5]">Справка</h2>
            <div className="space-y-4">
              <div>
                <p className="mb-2">Горячие клавиши:</p>
                <ul className="list-disc list-inside text-sm text-[#6c757d] space-y-1">
                  <li>F1 - Открыть справку</li>
                  <li>Ctrl+Enter - Быстрый запуск тестов</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-[#f19fb5] text-white px-6 py-3 rounded-lg shadow-lg z-[4000]">
          {notification}
        </div>
      )}
    </div>
  );
}

// Dashboard View
function DashboardView({ projectsData, testCasesData }: { projectsData: Project[]; testCasesData: TestCase[] }) {
  const totalTestCases = safeCount(testCasesData);
  const passedTestCases = safeCount(testCasesData.filter(tc => tc.status === 'passed'));
  const failedTestCases = safeCount(testCasesData.filter(tc => tc.status === 'failed'));

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[26px] text-[#1e1e1e]">Главная панель</h1>
        <p className="text-[#6c757d]">Обзор текущего состояния системы тестирования</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#f1d6df] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#6c757d]">Активные проекты</h3>
            <FolderOpen className="w-5 h-5 text-[#f19fb5]" />
          </div>
          <p className="text-sm text-[#6c757d]">из {projectsData.length} всего</p>
        </div>

        <div className="bg-white border border-[#f1d6df] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#6c757d]">Тест-кейсов</h3>
            <ClipboardList className="w-5 h-5 text-[#f19fb5]" />
          </div>
          <div className="text-[32px] text-[#f19fb5]">{totalTestCases}</div>
          <p className="text-sm text-[#6c757d]">всего в системе</p>
        </div>

        <div className="bg-white border border-[#f1d6df] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#6c757d]">Успешность</h3>
            <CheckCircle className="w-5 h-5 text-[#28a745]" />
          </div>
          <div className="text-[32px] text-[#28a745]">
            {totalTestCases > 0 ? Math.round((passedTestCases / totalTestCases) * 100) : 0}%
          </div>
          <p className="text-sm text-[#6c757d]">{passedTestCases} пройдено</p>
        </div>

        <div className="bg-white border border-[#f1d6df] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#6c757d]">Провалено</h3>
            <AlertCircle className="w-5 h-5 text-[#dc3545]" />
          </div>
          <div className="text-[32px] text-[#dc3545]">{failedTestCases}</div>
          <p className="text-sm text-[#6c757d]">требуют внимания</p>
        </div>
      </div>
    </>
  );
}

// Status Badge
function StatusBadge({ status, isArchived }: { status: string; isArchived: boolean }) {
  if (isArchived) {
    return (
      <span className="px-3 py-1 rounded-full text-sm bg-[#e2e3e5] text-[#383d41]">
        Архивирован
      </span>
    );
  }

  const styles: Record<string, string> = {
    active: 'bg-[#d4edda] text-[#155724]',
    pending: 'bg-[#fff3cd] text-[#856404]',
    completed: 'bg-[#d1ecf1] text-[#0c5460]',
  };

  const labels: Record<string, string> = {
    active: 'Активный',
    pending: 'В ожидании',
    completed: 'Завершен',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${styles[status] || styles.active}`}>
      {safeString(labels[status]) || status}
    </span>
  );
}

// Test Status Badge
function TestStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    passed: 'bg-[#d4edda] text-[#155724]',
    failed: 'bg-[#f8d7da] text-[#721c24]',
    pending: 'bg-[#fff3cd] text-[#856404]',
  };

  const labels: Record<string, string> = {
    passed: 'Пройден',
    failed: 'Провален',
    pending: 'Ожидает',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${styles[status] || styles.pending}`}>
      {safeString(labels[status]) || status}
    </span>
  );
}

// Projects View
function ProjectsView({
  currentUser,
  projectsData,
  setProjectsData,
  requirementsData,
  testCasesData,
  setTestCasesData,
  testSuitesData,
  setTestSuitesData,
  testPlansData,
  setTestPlansData,
  showError,
  reloadData
}: {
  currentUser: UserType;
  projectsData: Project[];
  setProjectsData: (data: Project[]) => void;
  requirementsData: Requirement[];
  testCasesData: TestCase[];
  setTestCasesData: (data: TestCase[]) => void;
  testSuitesData: TestSuite[];
  setTestSuitesData: (data: TestSuite[]) => void;
  testPlansData: TestPlan[];
  setTestPlansData: (data: TestPlan[]) => void;
  showError: (msg: string, type?: 'error' | 'success') => void;
  reloadData: () => Promise<void>;
}) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    responsible_name: currentUser.name,
    completion_date: '',
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация проектов
  const activeProjects = safeArray(projectsData).filter(p => !p.is_archived);

  const filteredProjects = activeProjects.filter(project => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(query) ||
      (project.responsible_name &&
       project.responsible_name.toLowerCase().includes(query))
    );
  });

  const handleCreateProject = async () => {
    if (!newProject.name.trim() || !newProject.responsible_name.trim()) {
      showError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      await apiClient.createProject(newProject);
      setShowNewProjectModal(false);
      setNewProject({ name: '', responsible_name: currentUser.name , completion_date: '', description: ''});
      await reloadData();
    } catch (error) {
      console.error('Failed to create project:', error);
      showError('Ошибка при создании проекта');
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (!confirm(`Вы уверены, что хотите удалить проект "${project.name}"?`)) {
      return;
    }

    try {
      await apiClient.deleteProject(project.id);
      await reloadData();
    } catch (error) {
      console.error('Failed to delete project:', error);
      showError('Ошибка при удалении проекта');
    }
  };

  const handleArchiveProject = async (project: Project) => {
    try {
      await apiClient.archiveProject(project.id);
      showError('Проект успешно архивирован', 'success');
      await reloadData();
    } catch (error) {
      console.error('Failed to archive project:', error);
      showError('Ошибка при архивации проекта');
    }
  };

  if (selectedProject) {
    return (
      <ProjectDetailView
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        requirementsData={requirementsData}
        testCasesData={testCasesData}
        setTestCasesData={setTestCasesData}
        testSuitesData={testSuitesData}
        setTestSuitesData={setTestSuitesData}
        testPlansData={testPlansData}
        setTestPlansData={setTestPlansData}
        showError={showError}
        reloadData={reloadData}
      />
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[26px] text-[#1e1e1e]">Проекты</h1>
          <p className="text-[#6c757d]">Управление проектами тестирования</p>
        </div>

        <button
          onClick={() => setShowNewProjectModal(true)}
          className="px-4 py-2 bg-[#f19fb5] text-white rounded-lg hover:bg-[#e27091] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Новый проект
        </button>
      </div>

      {/* Простая строка поиска */}
      <div className="mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6c757d]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск проектов по названию или ответственному..."
            className="w-full pl-10 pr-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-[#6c757d] mt-2">
            Найдено проектов: {filteredProjects.length} из {activeProjects.length}
          </p>
        )}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-white border border-[#f1d6df] rounded-lg p-8 text-center">
          <Search className="w-12 h-12 text-[#e8e9ea] mx-auto mb-4" />
          <h3 className="text-lg text-[#2b2f33] mb-2">
            {searchQuery ? 'Проекты не найдены' : 'Нет активных проектов'}
          </h3>
          <p className="text-[#6c757d] mb-4">
            {searchQuery
              ? 'Попробуйте изменить поисковый запрос'
              : 'Создайте первый проект, нажав на кнопку "Новый проект"'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-[#ffe9f0] text-[#f19fb5] rounded-lg hover:bg-[#ffd7db] transition-all"
            >
              Очистить поиск
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white border border-[#f1d6df] rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg text-[#f19fb5] mb-1">{project.name}</h3>
                  <p className="text-sm text-[#6c757d]">Создан: {project.responsible_name}</p>
                  <p className="text-sm text-[#6c757d]">Описание: {project.description}</p>
                  {project.completion_date && (
                    <p className="text-sm text-[#6c757d]">Срок выполнения: {new Date(project.completion_date).toLocaleDateString('ru-RU')}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleArchiveProject(project)}
                    className="p-2 text-[#6c757d] hover:text-[#f19fb5] hover:bg-[#ffe9f0] rounded-lg transition-all"
                    title="Архивировать"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project)}
                    className="p-2 text-[#6c757d] hover:text-[#b12e4a] hover:bg-[#ffd7db] rounded-lg transition-all"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <StatusBadge status={project.status} isArchived={project.is_archived} />
              </div>
              <button
                onClick={() => setSelectedProject(project)}
                className="w-full px-4 py-2 bg-[#ffe9f0] text-[#f19fb5] rounded-lg hover:bg-[#ffd7db] transition-all"
              >
                Подробнее
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setShowNewProjectModal(false)}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl text-[#f19fb5] mb-6">Новый проект</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">Название проекта</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Введите название"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">Срок выполнения (опционально)</label>
                <input
                  type="date"
                  value={newProject.completion_date}
                  onChange={(e) => setNewProject({ ...newProject, completion_date: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Введите дату"
                />
              </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">Описание проекта (опционально)</label>
                <input
                  type="text"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Введите описание"
                />
              </div>
            </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateProject}
                className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Project Detail View - Placeholder for now, will be continued
function ProjectDetailView({
  project,
  onBack,
  requirementsData,
  testCasesData,
  setTestCasesData,
  testSuitesData,
  setTestSuitesData,
  testPlansData,
  setTestPlansData,
  showError,
  reloadData
}: {
  project: Project;
  onBack: () => void;
  requirementsData: Requirement[];
  testCasesData: TestCase[];
  setTestCasesData: (data: TestCase[]) => void;
  testSuitesData: TestSuite[];
  setTestSuitesData: (data: TestSuite[]) => void;
  testPlansData: TestPlan[];
  setTestPlansData: (data: TestPlan[]) => void;
  showError: (msg: string, type?: 'error' | 'success') => void;
  reloadData: () => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState<'test-plans' | 'test-cases' | 'test-suites'>('test-plans');
  const [showNewTestCaseModal, setShowNewTestCaseModal] = useState(false);
  const [newTestCase, setNewTestCase] = useState({ name: '', description: '', data: '' });
  const [showNewTestPlanModal, setShowNewTestPlanModal] = useState(false);
  const [newTestPlan, setNewTestPlan] = useState({ name: '', description: '', deadline: '' });
  const [showNewTestSuiteModal, setShowNewTestSuiteModal] = useState(false);
  const [newTestSuite, setNewTestSuite] = useState({ name: '', description: '', date: ''});
  const [newProjectUpdate, setNewProjectUpdate] = useState({ id: project.id, completion_date: '', description: '' });

  // Состояния для редактирования
  const [editTestPlanModal, setEditTestPlanModal] = useState<{show: boolean; testPlan: TestPlan | null}>({show: false, testPlan: null});
  const [editTestCaseModal, setEditTestCaseModal] = useState<{show: boolean; testCase: TestCase | null}>({show: false, testCase: null});
  const [editTestSuiteModal, setEditTestSuiteModal] = useState<{show: boolean; testSuite: TestSuite | null}>({show: false, testSuite: null});

  const [editDescription, setEditDescription] = useState('');

  const projectTestCases = testCasesData.filter(tc => tc.project_id === project.id);
  const projectTestPlans = testPlansData.filter(tp => tp.project_id === project.id);
  const projectTestSuites = testSuitesData;
  const [showUpdateProjectModal, setShowUpdateProjectModal] = useState(false);

  const handleCreateTestCase = async () => {
    if (!newTestCase.name.trim()) {
      showError('Введите название тест-кейса');
      return;
    }

    try {
      await apiClient.createTestCase({
        project_id: project.id,
        name: newTestCase.name,
        description: newTestCase.description,
        data: newTestCase.data
      });
      setShowNewTestCaseModal(false);
      setNewTestCase({ name: '', description: 'pending', data: '' });
      await reloadData();
    } catch (error) {
      console.error('Failed to create test case:', error);
      showError('Ошибка при создании тест-кейса');
    }
  };

  const handleUpdateTestCase = async () => {
    if (!editTestCaseModal.testCase) return;

    try {
      await apiClient.updateTestCase({
        id: editTestCaseModal.testCase.id,
        description: editDescription
      });
      setEditTestCaseModal({show: false, testCase: null});
      setEditDescription('');
      await reloadData();
    } catch (error) {
      console.error('Failed to update test case:', error);
      showError('Ошибка при обновлении тест-кейса');
    }
  };

  const handleUpdateTestPlan = async () => {
    if (!editTestPlanModal.testPlan) return;

    try {
      await apiClient.updateTestPlan({
        id: editTestPlanModal.testPlan.id,
        description: editDescription
      });
      setEditDescription('');
      setEditTestPlanModal({show: false, testPlan: null});
      await reloadData();
    } catch (error) {
      console.error('Failed to update test plan:', error);
      showError('Ошибка при обновлении тест-плана');
    }
  };

  const handleUpdateTestSuite = async () => {
    if (!editTestSuiteModal.testSuite) return;

    try {
      await apiClient.updateTestSuite({
        id: editTestSuiteModal.testSuite.id,
        description: editDescription
      });
      setEditTestSuiteModal({show: false, testSuite: null});
      setEditDescription('');
      await reloadData();
    } catch (error) {
      console.error('Failed to update test suite:', error);
      showError('Ошибка при обновлении тестового набора');
    }
  };

  const handleDeleteTestCase = async (testCaseId: number) => {
    try {
      await apiClient.deleteTestCase(testCaseId);
      await reloadData();
    } catch (error) {
      console.error('Failed to delete test case:', error);
      showError('Ошибка при удалении тест-кейса');
    }
  };

  const handleDeleteTestSuite = async (testSuiteId: number) => {
    try {
      await apiClient.deleteTestSuite(testSuiteId);
      await reloadData();
    } catch (error) {
      console.error('Failed to delete test suite:', error);
      showError('Ошибка при удалении тестового набора');
    }
  };

  const handleCreateTestPlan = async () => {
    if (!newTestPlan.name.trim() || !newTestPlan.description.trim()) {
      showError('Заполните все обязательные поля');
      return;
    }

    try {
      await apiClient.createTestPlan({
        project_id: project.id,
        name: newTestPlan.name,
        description: newTestPlan.description,
        deadline: newTestPlan.deadline || undefined
      });
      setShowNewTestPlanModal(false);
      setNewTestPlan({ name: '', description: '', deadline: '' });
      await reloadData();
    } catch (error) {
      console.error('Failed to create test plan:', error);
      showError('Ошибка при создании тест-плана');
    }
  };

  const handleCreateTestSuite = async () => {
    if (!newTestSuite.name.trim()) {
      showError('Заполните все обязательные поля');
      return;
    }

    try {
      await apiClient.createTestSuite({
        name: newTestSuite.name,
        description: newTestSuite.description
      });
      setShowNewTestSuiteModal(false);
      setNewTestSuite({ name: '', description: '', date: ''});
      await reloadData();
    } catch (error) {
      console.error('Failed to create test plan:', error);
      showError('Ошибка при создании тестового набора');
    }
  };

  const handleDeleteTestPlan = async (testPlanId: number) => {
    try {
      await apiClient.deleteTestPlan(testPlanId);
      await reloadData();
    } catch (error) {
      console.error('Failed to delete test plan:', error);
      showError('Ошибка при удалении тест-плана');
    }
  };

  const handleUpdateProject = async () => {
    if (!newProjectUpdate.completion_date.trim()) {
      showError('Заполните поле даты');
      return
    }
    try {
      await apiClient.updateProjectDate({ id: newProjectUpdate.id, completion_date: newProjectUpdate.completion_date });
      await apiClient.updateProjectDescription({ id: newProjectUpdate.id, description: newProjectUpdate.description });
      setShowUpdateProjectModal(false);
      setNewProjectUpdate(newProjectUpdate)
      await reloadData();
    } catch (error) {
      console.error('Failed to update project:', error);
      showError('Ошибка при обновлении проекта');
    }
  };

  return (
    <>
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#6c757d] hover:text-[#f19fb5] mb-4"
        >
          <Undo2 className="w-4 h-4" />
          Назад к проектам
        </button>
        <h1 className="text-[26px] text-[#1e1e1e]">{project.name}</h1>
        <p className="text-[#6c757d]">Ответственный: {project.responsible_name}</p>
      </div>
        <button
          onClick={() => setShowUpdateProjectModal(true)}
          className="p-2 text-[#6c757d] hover:text-[#b12e4a] hover:bg-[#ffd7db] rounded-lg transition-all"
        >
          <Edit className="w-4 h-4"/>
        </button>
      {/* Update Project Modal */}
      {/* TODO: хз как это через такую форму сделать, тк класс проекта так не передать */}
      {showUpdateProjectModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setShowUpdateProjectModal(false)}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl text-[#f19fb5] mb-6">Обновление проекта</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-[#2b2f33]">Срок выполнения</label>
              <input
                type="date"
                value={newProjectUpdate.completion_date}
                onChange={(e) => {
                  setNewProjectUpdate({
                    ...newProjectUpdate,
                    completion_date: e.target.value
                  });
                }}
                className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                placeholder="Введите дату"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-[#2b2f33]">Описание (опционально)</label>
              <input
                type="text"
                value={newProjectUpdate.description}
                onChange={(e) => {
                  setNewProjectUpdate({
                    ...newProjectUpdate,
                    description: e.target.value
                  });
                }}
                className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                placeholder="Введите описание"
              />
            </div>
          </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUpdateProjectModal(false)}
                className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
              >
                Отмена
              </button>
              <button
                onClick={() => handleUpdateProject()}
                className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
              >
                Обновить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#e8e9ea]">
        <button
          onClick={() => setActiveTab('test-plans')}
          className={`px-4 py-2 ${
            activeTab === 'test-plans'
              ? 'border-b-2 border-[#f19fb5] text-[#f19fb5]'
              : 'text-[#6c757d]'
          }`}
        >
          Тест-планы
        </button>
        <button
          onClick={() => setActiveTab('test-cases')}
          className={`px-4 py-2 ${
            activeTab === 'test-cases'
              ? 'border-b-2 border-[#f19fb5] text-[#f19fb5]'
              : 'text-[#6c757d]'
          }`}
        >
          Тест-кейсы
        </button>
        <button
          onClick={() => setActiveTab('test-suites')}
          className={`px-4 py-2 ${
            activeTab === 'test-suites'
              ? 'border-b-2 border-[#f19fb5] text-[#f19fb5]'
              : 'text-[#6c757d]'
          }`}
        >
          Тестовые наборы
        </button>
      </div>

      {/* Test Plans Tab */}
      {activeTab === 'test-plans' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-[#1e1e1e]">Тест-планы</h2>
            <button
              onClick={() => setShowNewTestPlanModal(true)}
              className="px-4 py-2 bg-[#f19fb5] text-white rounded-lg hover:bg-[#e27091] transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Новый тест-план
            </button>
          </div>
          <div className="space-y-3">
            {projectTestPlans.map((plan) => (
              <div key={plan.id} className="bg-white border border-[#f1d6df] rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#f19fb5] mb-1">{plan.name}</h3>
                    <p className="text-sm text-[#6c757d]">Описание: {plan.description}</p>
                    {plan.deadline && (
                      <p className="text-sm text-[#6c757d] mt-1">
                        Дедлайн: {new Date(plan.deadline).toLocaleDateString('ru-RU')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditTestPlanModal({show: true, testPlan: plan});
                        setEditDescription(plan.description);
                      }}
                      className="p-2 text-[#6c757d] hover:text-[#f19fb5] hover:bg-[#ffd7db] rounded-lg transition-all"
                      title="Редактировать описание"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTestPlan(plan.id)}
                      className="p-2 text-[#6c757d] hover:text-[#b12e4a] hover:bg-[#ffd7db] rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {projectTestPlans.length === 0 && (
              <div className="text-center text-[#6c757d] py-8">
                Нет тест-планов
              </div>
            )}
          </div>
        </div>
      )}

      {/* Test Cases Tab */}
      {activeTab === 'test-cases' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-[#1e1e1e]">Тест-кейсы</h2>
            <button
              onClick={() => setShowNewTestCaseModal(true)}
              className="px-4 py-2 bg-[#f19fb5] text-white rounded-lg hover:bg-[#e27091] transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Новый тест-кейс
            </button>
          </div>
          <div className="space-y-3">
            {projectTestCases.map((testCase) => (
              <div key={testCase.id} className="bg-white border border-[#f1d6df] rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-[#f19fb5] mb-2">{testCase.name}</h3>
                    <TestStatusBadge status={testCase.status} />
                    <p className="text-sm text-[#6c757d] mt-1">Описание: {testCase.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditTestCaseModal({show: true, testCase: testCase});
                        setEditDescription(testCase.description!);
                      }}
                      className="p-2 text-[#6c757d] hover:text-[#f19fb5] hover:bg-[#ffd7db] rounded-lg transition-all"
                      title="Редактировать описание"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTestCase(testCase.id)}
                      className="p-2 text-[#6c757d] hover:text-[#b12e4a] hover:bg-[#ffd7db] rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {projectTestCases.length === 0 && (
              <div className="text-center text-[#6c757d] py-8">
                Нет тест-кейсов
              </div>
            )}
          </div>
        </div>
      )}

      {/* Test Suites Tab */}
      {activeTab === 'test-suites' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-[#1e1e1e]">Тестовые наборы</h2>
            <button
              onClick={() => setShowNewTestSuiteModal(true)}
              className="px-4 py-2 bg-[#f19fb5] text-white rounded-lg hover:bg-[#e27091] transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Новый тестовый набор
            </button>
          </div>
          <div className="space-y-3">
            {projectTestSuites.map((testSuite) => (
              <div key={testSuite.id} className="bg-white border border-[#f1d6df] rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="text-[#6c757d] mb-2">{testSuite.name}</h5>
                    <h5 className="text-[#6c757d] mb-2">Описание: {testSuite.description}</h5>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditTestSuiteModal({show: true, testSuite: testSuite});
                        setEditDescription(testSuite.description!);
                      }}
                      className="p-2 text-[#6c757d] hover:text-[#f19fb5] hover:bg-[#ffd7db] rounded-lg transition-all"
                      title="Редактировать описание"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTestSuite(testSuite.id)}
                      className="p-2 text-[#6c757d] hover:text-[#b12e4a] hover:bg-[#ffd7db] rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {projectTestSuites.length === 0 && (
              <div className="text-center text-[#6c757d] py-8">
                Нет тестовых планов
              </div>
            )}
          </div>
        </div>
      )}

      {/* Модальное окно редактирования тест-плана */}
      {editTestPlanModal.show && editTestPlanModal.testPlan && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setEditTestPlanModal({show: false, testPlan: null})}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl text-[#f19fb5] mb-6">
              Редактировать описание тест-плана
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">
                  Описание
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => {
                    setEditDescription(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Введите описание тест-плана"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setEditTestPlanModal({show: false, testPlan: null});
                  editTestPlanModal.show = false;
                }}
                className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleUpdateTestPlan}
                className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования тест-кейса */}
      {editTestCaseModal.show && editTestCaseModal.testCase && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setEditTestCaseModal({show: false, testCase: null})}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl text-[#f19fb5] mb-6">
              Редактировать описание тест-кейса
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">
                  Описание
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Введите описание тест-кейса"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setEditTestCaseModal({show: false, testCase: null});
                  editTestCaseModal.show = false;
                }}
                className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleUpdateTestCase}
                className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования тестового набора */}
      {editTestSuiteModal.show && editTestSuiteModal.testSuite && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setEditTestSuiteModal({show: false, testSuite: null})}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl text-[#f19fb5] mb-6">
              Редактировать описание тестового набора
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">
                  Описание
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Введите описание тестового набора"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setEditTestSuiteModal({show: false, testSuite: null});
                  editTestSuiteModal.show = false;
                }}
                className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleUpdateTestSuite}
                className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Test Case Modal */}
      {showNewTestCaseModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setShowNewTestCaseModal(false)}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl text-[#f19fb5] mb-6">Новый тест-кейс</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">Название</label>
                <input
                  type="text"
                  value={newTestCase.name}
                  onChange={(e) => setNewTestCase({ ...newTestCase, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Введите название..."
                />
              </div>
              <div>
                <label className="block mb-2">Описание</label>
                <textarea
                  value={newTestCase.description}
                  onChange={(e) => setNewTestCase({...newTestCase, description: e.target.value})}
                  placeholder="Введите описание тест-кейса..."
                  className="w-full px-4 py-2.5 border border-[#f1d6df] rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                  <label className="block text-sm mb-2 text-[#2b2f33]">Данные тест-кейса (опционально)</label>
                  <input
                    type="text"
                    value={newTestCase.data}
                    onChange={(e) => setNewTestCase({ ...newTestCase, data: e.target.value })}
                    className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                    placeholder="Введите название..."
                  />
                </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewTestCaseModal(false)}
                className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateTestCase}
                className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Test Suite Modal */}
      {showNewTestSuiteModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setShowNewTestSuiteModal(false)}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl text-[#f19fb5] mb-6">Новый тестовый набор</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">Название</label>
                <input
                  type="text"
                  value={newTestSuite.name}
                  onChange={(e) => setNewTestSuite({ ...newTestSuite, name: e.target.value})}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Введите название..."
                />
              </div>
            </div>
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">Описание (опционально)</label>
                <input
                  type="text"
                  value={newTestSuite.description}
                  onChange={(e) => setNewTestSuite({ ...newTestSuite, description: e.target.value})}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Введите описание..."
                />
              </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewTestSuiteModal(false)}
                className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateTestSuite}
                className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Test Plan Modal */}
      {showNewTestPlanModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setShowNewTestPlanModal(false)}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl text-[#f19fb5] mb-6">Новый тест-план</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">Название</label>
                <input
                  type="text"
                  value={newTestPlan.name}
                  onChange={(e) => setNewTestPlan({ ...newTestPlan, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Введите название"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">Описание</label>
                <textarea
                  value={newTestPlan.description}
                  onChange={(e) => setNewTestPlan({ ...newTestPlan, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Опишите цель тест-плана"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">Дедлайн (опционально)</label>
                <input
                  type="date"
                  value={newTestPlan.deadline}
                  onChange={(e) => setNewTestPlan({ ...newTestPlan, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewTestPlanModal(false)}
                className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateTestPlan}
                className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Archived Projects View
function ArchivedProjectsView({
  projectsData,
  setProjectsData,
  showError,
  reloadData
}: {
  projectsData: Project[];
  setProjectsData: (data: Project[]) => void;
  showError: (msg: string, type?: 'error' | 'success') => void;
  reloadData: () => Promise<void>;
}) {
  const archivedProjects = projectsData.filter(p => p.is_archived);

  const handleDeleteProject = async (project: Project) => {
    if (!confirm(`Вы уверены, что хотите удалить проект "${project.name}"?`)) {
      return;
    }

    try {
      await apiClient.deleteProject(project.id);
      await reloadData();
    } catch (error) {
      console.error('Failed to delete project:', error);
      showError('Ошибка при удалении проекта');
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[26px] text-[#1e1e1e]">Архивные проекты</h1>
        <p className="text-[#6c757d]">Просмотр архивированных проектов</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {archivedProjects.map((project) => (
          <div key={project.id} className="bg-white border border-[#f1d6df] rounded-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg text-[#6c757d] mb-1">{project.name}</h3>
                <p className="text-sm text-[#6c757d]">Ответственный: {project.responsible_name}</p>
              </div>
              <button
                onClick={() => handleDeleteProject(project)}
                className="p-2 text-[#6c757d] hover:text-[#b12e4a] hover:bg-[#ffd7db] rounded-lg transition-all"
                title="Удалить"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <StatusBadge status={project.status} isArchived={project.is_archived} />
          </div>
        ))}
        {archivedProjects.length === 0 && (
          <div className="col-span-full text-center text-[#6c757d] py-12">
            Нет архивных проектов
          </div>
        )}
      </div>
    </>
  );
}

// Requirements View
function RequirementsView({
  requirementsData,
  setRequirementsData,
  showError
}: {
  requirementsData: Requirement[];
  setRequirementsData: (data: Requirement[]) => void;
  showError: (msg: string, type?: 'error' | 'success') => void;
}) {
  const [showNewRequirementModal, setShowNewRequirementModal] = useState(false);
  const [newRequirement, setNewRequirement] = useState({
    name: '',
    description: '',
    project_id: '' as number | ''
  });
  const [loading, setLoading] = useState(false);
  
  // Состояние для хранения реальных проектов
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const projects = await apiClient.getProjects();
      // Фильтруем только активные проекты (не архивные)
      const activeProjects = projects.filter(project => !project.is_archived);
      setProjectsData(activeProjects);
      
      // Устанавливаем первый проект по умолчанию, если есть активные проекты
      // Используем текущее значение newRequirement через callback
      setNewRequirement(prev => {
        if (activeProjects.length > 0 && !prev.project_id) {
          return {
            ...prev,
            project_id: activeProjects[0].id
          };
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to load projects:', error);
      showError('Ошибка загрузки списка проектов');
    } finally {
      setLoadingProjects(false);
    }
  };

  // Загружаем проекты при открытии модального окна
  useEffect(() => {
    if (showNewRequirementModal) {
      loadProjects();
    }
  }, [showNewRequirementModal]);

  const handleCreateRequirement = async () => {
    if (!newRequirement.name.trim()) {
      showError('Введите название требования');
      return;
    }

    // project_id теперь необязательный, но лучше проверить
    if (!newRequirement.project_id && projectsData.length > 0) {
      // Если не выбран проект, но есть активные проекты
      // можно установить первый по умолчанию или показать ошибку
      showError('Выберите проект для требования');
      return;
    }

    setLoading(true);
    try {
      // Подготавливаем данные для отправки
      const requirementData: any = {
        name: newRequirement.name,
        description: newRequirement.description
      };
      
      const createdRequirement = await apiClient.createRequirement(requirementData);
      
      setNewRequirement({ 
        name: '', 
        description: '', 
        project_id: projectsData.length > 0 ? projectsData[0].id : ''
      });
      
      setShowNewRequirementModal(false);
      
    } catch (error) {
      console.error('Failed to create requirement:', error);
      showError('Ошибка при создании требования');
    } finally {
      setLoading(false);
    }
  };

  // Получаем название выбранного проекта
  const getSelectedProjectInfo = () => {
    if (!newRequirement.project_id || projectsData.length === 0) {
      return { name: 'Не выбран', description: '', responsible: '' };
    }
    
    const project = projectsData.find(p => p.id === newRequirement.project_id);
    return {
      name: project ? project.name : 'Неизвестный проект',
      description: project?.description || '',
      responsible: project?.responsible_name || ''
    };
  };

  const projectInfo = getSelectedProjectInfo();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[26px] text-[#1e1e1e]">Требования</h1>
          <p className="text-[#6c757d]">Управление требованиями системы</p>
        </div>

        <button
          onClick={() => setShowNewRequirementModal(true)}
          className="px-4 py-2 bg-[#f19fb5] text-white rounded-lg hover:bg-[#e27091] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Новое требование
        </button>
      </div>

      {requirementsData.length === 0 ? (
        <div className="bg-white border border-[#f1d6df] rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 text-[#e8e9ea] mx-auto mb-4" />
          <h3 className="text-lg text-[#2b2f33] mb-2">Нет требований</h3>
          <p className="text-[#6c757d] mb-4">
            Создайте первое требование, нажав на кнопку "Новое требование"
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#f1d6df] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#fff6fb]">
                <th className="text-left py-3 px-4 text-[#444]">Название</th>
                <th className="text-left py-3 px-4 text-[#444]">Описание</th>
                <th className="text-left py-3 px-4 text-[#444]">Дата создания</th>
              </tr>
            </thead>
            <tbody>
              {requirementsData.map((req) => (
                <tr key={req.id} className="border-b border-[#f1d6df] last:border-b-0 hover:bg-[#fffafc]">
                  <td className="py-3 px-4 font-medium">{req.name}</td>
                  <td className="py-3 px-4">{req.description}</td>
                  <td className="py-3 px-4 text-sm text-[#6c757d]">
                    {new Date(req.created_at).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Requirement Modal */}
      {showNewRequirementModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setShowNewRequirementModal(false)}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl text-[#f19fb5] mb-6">Новое требование</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">
                  Название требования <span className="text-[#dc3545]">*</span>
                </label>
                <input
                  type="text"
                  value={newRequirement.name}
                  onChange={(e) => setNewRequirement({ ...newRequirement, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Введите название требования"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">
                  Проект {projectsData.length > 0 && <span className="text-[#dc3545]">*</span>}
                </label>
                {loadingProjects ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-4 h-4 border-2 border-[#f19fb5] border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="text-sm text-[#6c757d]">Загрузка проектов...</span>
                  </div>
                ) : projectsData.length === 0 ? (
                  <div className="p-3 bg-[#fff3cd] border border-[#ffeaa7] rounded-lg">
                    <p className="text-sm text-[#856404]">
                      Нет активных проектов. Создайте проект в разделе "Проекты" перед добавлением требований.
                    </p>
                  </div>
                ) : (
                  <>
                    <select
                      value={newRequirement.project_id || ''}
                      onChange={(e) => setNewRequirement({ 
                        ...newRequirement, 
                        project_id: e.target.value ? Number(e.target.value) : ''
                      })}
                      className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                      disabled={loading}
                    >
                      {projectsData.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                    
                    {newRequirement.project_id && (
                      <div className="mt-2 p-2 bg-[#f8f9fa] border border-[#e8e9ea] rounded-lg">
                        <p className="text-xs text-[#6c757d]">
                          <strong>Выбран проект:</strong> {projectInfo.name}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">
                  Описание требования
                </label>
                <textarea
                  value={newRequirement.description}
                  onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Опишите требование подробнее"
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewRequirementModal(false)}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateRequirement}
                disabled={loading || !newRequirement.name.trim() || (projectsData.length > 0 && !newRequirement.project_id)}
                className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Создание...
                  </>
                ) : (
                  'Создать'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Reports View
function ReportsView({
  showError,
  testReportsData,
  projectsData,
  testPlansData,
  testSuitesData,
  reloadData
}: {
  showError: (msg: string, type?: 'error' | 'success') => void;
  testReportsData: TestReport[];
  projectsData: Project[];
  testPlansData: TestPlan[];
  testSuitesData: TestSuite[];
  reloadData: () => Promise<void>;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const getProjectName = (projectId: number) => {
    const project = projectsData.find(p => p.id === projectId);
    return project?.name || `Проект #${projectId}`;
  };

  const getTestPlanName = (testPlanId?: number) => {
    if (!testPlanId) return 'N/A';
    const plan = testPlansData.find(p => p.id === testPlanId);
    return plan?.name || `План #${testPlanId}`;
  };

  const getTestSuiteName = (testSuiteId?: number) => {
    if (!testSuiteId) return 'N/A';
    const suite = testSuitesData.find(s => s.id === testSuiteId);
    return suite?.name || `Набор #${testSuiteId}`;
  };

  const handleDeleteReports = async (report: TestReport) => {
    if (!confirm(`Вы уверены, что хотите удалить отчет "${report.id}"?`)) {
      return;
    }

    try {
      // await apiClient.deleteTestReport(report.id);
      await reloadData();
    } catch (error) {
      console.error('Failed to delete report:', error);
      showError('Ошибка при удалении отчета');
    }
  };

  // Фильтрация отчётов по нескольким полям
  const filteredReports = testReportsData.filter(report => {
    const query = searchQuery.toLowerCase();

    // Проверяем совпадение по ID отчёта
    if (report.id.toString().includes(query)) return true;

    // По ID проекта
    if (report.project_id.toString().includes(query)) return true;

    // По названию проекта (если есть совпадение в имени)
    const projectName = getProjectName(report.project_id);
    if (projectName.toLowerCase().includes(query)) return true;

    // По ID тест-плана
    if (report.test_plan_id && report.test_plan_id.toString().includes(query)) return true;

    // По названию тест-плана
    const testPlanName = getTestPlanName(report.test_plan_id);
    if (testPlanName.toLowerCase().includes(query)) return true;

    // По ID тестового набора
    if (report.test_suite_id && report.test_suite_id.toString().includes(query)) return true;

    // По названию тестового набора
    const testSuiteName = getTestSuiteName(report.test_suite_id);
    if (testSuiteName.toLowerCase().includes(query)) return true;

    return false;
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[26px] text-[#1e1e1e]">Отчеты</h1>
        <p className="text-[#6c757d]">Просмотр отчетов о тестировании</p>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6c757d]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск отчетов по ID, названию проекта, тест-плана или набора..."
            className="w-full pl-10 pr-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white border border-[#f1d6df] rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-[#f19fb5] mb-1">Отчет #{report.id}</h3>
                <p className="text-sm text-[#6c757d]">Проект: {getProjectName(report.project_id)}</p>
                <p className="text-sm text-[#6c757d]">Тест-план: {getTestPlanName(report.test_plan_id)}</p>
                <p className="text-sm text-[#6c757d]">Тестовый набор: {getTestSuiteName(report.test_suite_id)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#6c757d]">Пройдено: {report.passed_tests}</p>
                <p className="text-sm text-[#6c757d]">Длительность: {report.duration} сек</p>
                <p className="text-xs text-[#6c757d] mt-1">
                  {new Date(report.created_at).toLocaleString('ru-RU')}
                </p>
              </div>
              <button
                onClick={() => handleDeleteReports(report)}
                className="p-2 text-[#6c757d] hover:text-[#b12e4a] hover:bg-[#ffd7db] rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filteredReports.length === 0 && (
          <div className="text-center text-[#6c757d] py-12">
            {searchQuery
              ? `Нет отчетов, соответствующих запросу "${searchQuery}"`
              : 'Нет отчетов'}
          </div>
        )}
      </div>
    </>
  );
}

// Testing View
function TestingView({
  projectsData = [],
  testPlansData = [],
  testSuitesData = [],
  testCasesData = [],
  handleRunTests,
  showError
}: {
  projectsData?: Project[];
  testPlansData?: TestPlan[];
  testSuitesData?: TestSuite[];
  testCasesData?: TestCase[];
  handleRunTests: (projectId: number, testPlanId: number, testSuiteId: number) => void;
  showError: (msg: string, type?: 'error' | 'success') => void;
}) {
  const [selectedProject, setSelectedProject] = useState<number | ''>('');
  const [selectedPlan, setSelectedPlan] = useState<number | ''>('');
  const [selectedTestSuite, setSelectedTestSuite] = useState<number | ''>('');

  // Фильтруем тест-планы по выбранному проекту
  const filteredTestPlans = selectedProject && testPlansData
    ? testPlansData.filter(plan => plan.project_id === selectedProject)
    : [];

  // Фильтруем тест-кейсы по выбранному проекту
  const filteredTestCases = selectedProject && testCasesData
    ? testCasesData.filter(testCase => testCase.project_id === selectedProject)
    : [];

  // Сбрасываем выбор тест-плана и тестового набора при смене проекта
  useEffect(() => {
    setSelectedPlan('');
    setSelectedTestSuite('');
  }, [selectedProject]);

  // Сбрасываем выбор тестового набора при смене тест-плана
  useEffect(() => {
    setSelectedTestSuite('');
  }, [selectedPlan]);

  const handleRun = () => {
    if (!selectedProject) {
      showError('Выберите проект');
      return;
    }
    if (!selectedPlan) {
      showError('Выберите тест-план');
      return;
    }
    if (!selectedTestSuite) {
      showError('Выберите тестовый набор');
      return;
    }
    
    handleRunTests(selectedProject, selectedPlan, selectedTestSuite);
  };

  // Получаем статистику тестов по выбранному проекту
  const passedTests = filteredTestCases.filter(tc => tc.status === 'passed').length;
  const failedTests = filteredTestCases.filter(tc => tc.status === 'failed').length;
  const pendingTests = filteredTestCases.filter(tc => tc.status === 'pending').length;
  const totalTests = filteredTestCases.length;

  // Получаем активные проекты (не архивные)
  const activeProjects = projectsData
    ? projectsData.filter(project => !project.is_archived)
    : [];

  // Находим выбранный проект для отображения названия
  const selectedProjectObj = selectedProject
    ? projectsData?.find(p => p.id === selectedProject)
    : null;

  // Находим выбранный тест-план для отображения названия
  const selectedPlanObj = selectedPlan
    ? testPlansData?.find(p => p.id === selectedPlan)
    : null;

  // Находим выбранный тестовый набор для отображения названия
  const selectedTestSuiteObj = selectedTestSuite
    ? testSuitesData?.find(s => s.id === selectedTestSuite)
    : null;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[26px] text-[#1e1e1e]">Тестирование</h1>
        <p className="text-[#6c757d]">Запуск и управление тестами</p>
      </div>

      <div className="bg-white border border-[#f1d6df] rounded-lg p-6 mb-6">
        <h3 className="text-lg mb-4">Настройка тестирования</h3>
        
        {/* Выбор проекта */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-[#2b2f33]">
            Выбор проекта
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
          >
            <option value="">Выберите проект</option>
            {activeProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name} {project.status === 'active' ? '✅' : '⏸️'}
              </option>
            ))}
          </select>
          {selectedProjectObj && (
            <p className="text-sm text-[#6c757d] mt-2">
              Выбран проект: {selectedProjectObj.name}
            </p>
          )}
          {activeProjects.length === 0 && (
            <p className="text-sm text-[#ff6b6b] mt-2">
              Нет доступных проектов. Создайте проект в разделе "Проекты".
            </p>
          )}
        </div>

        {/* Выбор тест-плана */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-[#2b2f33]">
            Выбор тест-плана
          </label>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
            disabled={!selectedProject}
          >
            <option value="">{selectedProject ? 'Выберите тест-план' : 'Сначала выберите проект'}</option>
            {filteredTestPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} {plan.deadline && `(до ${new Date(plan.deadline).toLocaleDateString('ru-RU')})`}
              </option>
            ))}
          </select>
          {selectedPlanObj && (
            <p className="text-sm text-[#6c757d] mt-2">
              Выбран тест-план: {selectedPlanObj.name}
              {selectedPlanObj.goal && (
                <span className="ml-2">- {selectedPlanObj.goal}</span>
              )}
            </p>
          )}
          {selectedProject && filteredTestPlans.length === 0 && testPlansData && testPlansData.length > 0 && (
            <p className="text-sm text-[#ff6b6b] mt-2">
              Для этого проекта нет тест-планов. Создайте тест-план в деталях проекта.
            </p>
          )}
        </div>

        {/* Выбор тестового набора */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-[#2b2f33]">
            Выбор тестового набора
          </label>
          <select
            value={selectedTestSuite}
            onChange={(e) => setSelectedTestSuite(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
            disabled={!selectedProject}
          >
            <option value="">{selectedProject ? 'Выберите тестовый набор' : 'Сначала выберите проект'}</option>
            {testSuitesData && testSuitesData.map((suite) => (
              <option key={suite.id} value={suite.id}>
                {suite.name} {suite.description && `- ${suite.description}`}
              </option>
            ))}
          </select>
          {selectedTestSuiteObj && (
            <p className="text-sm text-[#6c757d] mt-2">
              Выбран тестовый набор: {selectedTestSuiteObj.name}
            </p>
          )}
        </div>

        <button
          onClick={() => {
            if (!selectedProjectObj || !selectedPlanObj || !selectedTestSuiteObj) {
              showError('Выберите проект, тест-план и тестовый набор');
              return;
            }
            if (!selectedProjectObj.id || !selectedPlanObj.id || !selectedTestSuiteObj.id) {
              showError('Ошибка: у одного из выбранных элементов отсутствует ID');
              return;
            }
            handleRunTests(selectedProjectObj.id, selectedPlanObj.id, selectedTestSuiteObj.id);
          }}
          disabled={!selectedProject || !selectedPlan || !selectedTestSuite}
          className="w-full px-6 py-3 bg-[#f19fb5] text-white rounded-lg hover:bg-[#e27091] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayCircle className="w-5 h-5" />
          Запустить тесты
        </button>
        
        <div className="mt-4 text-sm text-[#6c757d] text-center">
          {selectedProject && selectedPlan && selectedTestSuite ? (
            <p>
              Готово к запуску: {selectedProjectObj?.name} → 
              {selectedPlanObj?.name} → 
              {selectedTestSuiteObj?.name}
            </p>
          ) : (
            <p>Выберите проект, тест-план и тестовый набор для запуска тестирования</p>
          )}
        </div>
      </div>
    </>
  );
}

// Profile View
function ProfileView({ currentUser }: { currentUser: UserType }) {
  const roleLabels: Record<string, string> = {
    'admin': 'Администратор',
    'manager': 'Менеджер',
    'test-analyst': 'Тест-аналитик',
    'tester': 'Тестировщик',
    'reader': 'Читатель'
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[26px] text-[#1e1e1e]">Профиль</h1>
        <p className="text-[#6c757d]">Информация о текущем пользователе</p>
      </div>

      <div className="bg-white border border-[#f1d6df] rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[#ffe9f0] rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-[#f19fb5]" />
          </div>
          <div>
            <h2 className="text-xl text-[#f19fb5]">{safeString(currentUser.name)}</h2>
            <p className="text-[#6c757d]">{safeString(currentUser.username)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#6c757d]">Роль</label>
            <p className="text-[#2b2f33]">{roleLabels[currentUser.role] || currentUser.role}</p>
          </div>
          <div>
            <label className="text-sm text-[#6c757d]">Дата создания</label>
            <p className="text-[#2b2f33]">{new Date(currentUser.created_at).toLocaleDateString('ru-RU')}</p>
          </div>
        </div>
      </div>
    </>
  );
}

// System Settings View
function SystemSettingsView({
  currentUser,
  showError
}: {
  currentUser: UserType;
  showError: (msg: string, type?: 'error' | 'success') => void;
}) {
  if (currentUser.role !== 'admin') {
    return (
      <div className="text-center text-[#6c757d] py-12">
        У вас нет доступа к настройкам системы
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[26px] text-[#1e1e1e]">Настройки системы</h1>
        <p className="text-[#6c757d]">Управление системой (доступно только администраторам)</p>
      </div>

      <div className="bg-white border border-[#f1d6df] rounded-lg p-6">
        <h3 className="text-lg mb-4">Системная информация</h3>
        <div className="space-y-2 text-sm text-[#6c757d]">
          <p>Версия: BETA</p>
          <p>API URL: {window.location.protocol}//{window.location.hostname}:8080</p>
          <p>Текущий пользователь: {currentUser.name} ({currentUser.role})</p>
        </div>
      </div>
    </>
  );
}