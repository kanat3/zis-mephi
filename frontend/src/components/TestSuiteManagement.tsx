import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, X, Link as LinkIcon } from 'lucide-react';
import type { TestSuite, TestCase } from '../services/api';
import { apiClient } from '../services/api';

interface TestSuiteManagementProps {
  testSuitesData: TestSuite[];
  testCasesData: TestCase[];
  showError: (msg: string, type?: 'error' | 'success') => void;
  reloadData: () => Promise<void>;
}

export function TestSuiteManagement({ testSuitesData, testCasesData, showError, reloadData }: TestSuiteManagementProps) {
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<TestSuite | null>(null);
  const [newSuite, setNewSuite] = useState({ name: '', description: '' });
  const [editingSuite, setEditingSuite] = useState<TestSuite | null>(null);
  const [suiteTestCases, setSuiteTestCases] = useState<number[]>([]);

  const handleCreateSuite = async () => {
    if (!newSuite.name.trim()) {
      showError('Введите название');
      return;
    }

    // TODO: Backend - createTestSuite not implemented yet
    try {
      // await apiClient.createTestSuite(newSuite);
      // showError('Тестовый набор создан', 'success');
      // setShowNewModal(false);
      // setNewSuite({ name: '', description: '' });
      // await reloadData();
      
      showError('TODO: Функция создания тестового набора будет доступна после реализации на бекенде');
    } catch (error) {
      console.error('Failed to create test suite:', error);
      showError('Ошибка при создании тестового набора');
    }
  };

  const handleUpdateSuite = async () => {
    if (!editingSuite) return;

    // TODO: Backend - updateTestSuite not implemented yet
    try {
      // await apiClient.updateTestSuite(editingSuite.id, {
      //   name: editingSuite.name,
      //   description: editingSuite.description,
      // });
      // showError('Тестовый набор обновлен', 'success');
      // setShowEditModal(false);
      // await reloadData();
      
      showError('TODO: Функция редактирования тестового набора будет доступна после реализации на бекенде');
    } catch (error) {
      console.error('Failed to update test suite:', error);
      showError('Ошибка при обновлении тестового набора');
    }
  };

  const handleDeleteSuite = async (suite: TestSuite) => {
    if (!confirm(`Вы уверены, что хотите удалить тестовый набор "${suite.name}"?`)) {
      return;
    }

    // TODO: Backend - deleteTestSuite not implemented yet
    try {
      // await apiClient.deleteTestSuite(suite.id);
      // showError('Тестовый набор удален', 'success');
      // await reloadData();
      
      showError('TODO: Функция удаления тестового набора будет доступна после реализации на бекенде');
    } catch (error) {
      console.error('Failed to delete test suite:', error);
      showError('Ошибка при удалении тестового набора');
    }
  };

  const handleViewSuite = async (suite: TestSuite) => {
    setSelectedSuite(suite);
    // Load test cases for this suite
    // For now, using mock data from test_case_ids if available
    setSuiteTestCases(suite.test_case_ids || []);
    setShowViewModal(true);
  };

  const handleAddTestCase = async (testCaseId: number) => {
    if (!selectedSuite) return;

    try {
      await apiClient.addTestCaseToTestSuite(selectedSuite.id, testCaseId);
      showError('Тест-кейс добавлен в набор', 'success');
      setSuiteTestCases([...suiteTestCases, testCaseId]);
    } catch (error) {
      console.error('Failed to add test case:', error);
      showError('Ошибка при добавлении тест-кейса');
    }
  };

  const handleRemoveTestCase = async (testCaseId: number) => {
    if (!selectedSuite) return;

    try {
      await apiClient.removeTestCaseFromTestSuite(selectedSuite.id, testCaseId);
      showError('Тест-кейс удален из набора', 'success');
      setSuiteTestCases(suiteTestCases.filter(id => id !== testCaseId));
    } catch (error) {
      console.error('Failed to remove test case:', error);
      showError('Ошибка при удалении тест-кейса');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl text-[#1e1e1e]">Тестовые наборы</h2>
          <p className="text-sm text-[#6c757d]">Управление тестовыми наборами</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 bg-[#f19fb5] text-white rounded-lg hover:bg-[#e27091] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Новый набор
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testSuitesData.map((suite) => (
          <div key={suite.id} className="bg-white border border-[#f1d6df] rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-[#f19fb5] mb-1">{suite.name}</h3>
                {suite.description && (
                  <p className="text-sm text-[#6c757d]">{suite.description}</p>
                )}
                <p className="text-xs text-[#6c757d] mt-2">
                  Тест-кейсов: {suite.test_case_ids?.length || 0}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewSuite(suite)}
                  className="p-2 text-[#6c757d] hover:text-[#f19fb5] hover:bg-[#ffe9f0] rounded-lg transition-all"
                  title="Просмотр"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEditingSuite(suite);
                    setShowEditModal(true);
                  }}
                  className="p-2 text-[#6c757d] hover:text-[#f19fb5] hover:bg-[#ffe9f0] rounded-lg transition-all"
                  title="Редактировать"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSuite(suite)}
                  className="p-2 text-[#6c757d] hover:text-[#b12e4a] hover:bg-[#ffd7db] rounded-lg transition-all"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {testSuitesData.length === 0 && (
          <div className="col-span-full text-center text-[#6c757d] py-12">
            Нет тестовых наборов
          </div>
        )}
      </div>

      {/* New Suite Modal */}
      {showNewModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setShowNewModal(false)}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-[#f19fb5]">Новый тестовый набор</h2>
              <button onClick={() => setShowNewModal(false)} className="text-[#6c757d] hover:text-[#2b2f33]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">Название</label>
                <input
                  type="text"
                  value={newSuite.name}
                  onChange={(e) => setNewSuite({ ...newSuite, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  placeholder="Название набора"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">Описание</label>
                <textarea
                  value={newSuite.description}
                  onChange={(e) => setNewSuite({ ...newSuite, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  rows={3}
                  placeholder="Описание набора"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewModal(false)}
                className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateSuite}
                className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Suite Modal */}
      {showEditModal && editingSuite && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-[#f19fb5]">Редактировать тестовый набор</h2>
              <button onClick={() => setShowEditModal(false)} className="text-[#6c757d] hover:text-[#2b2f33]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">Название</label>
                <input
                  type="text"
                  value={editingSuite.name}
                  onChange={(e) => setEditingSuite({ ...editingSuite, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#2b2f33]">Описание</label>
                <textarea
                  value={editingSuite.description || ''}
                  onChange={(e) => setEditingSuite({ ...editingSuite, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleUpdateSuite}
                className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Suite Modal */}
      {showViewModal && selectedSuite && (
        <div
          className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center"
          onClick={() => setShowViewModal(false)}
        >
          <div
            className="bg-white rounded-[10px] p-8 max-w-[700px] w-[90%] max-h-[80vh] overflow-y-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl text-[#f19fb5]">{selectedSuite.name}</h2>
                {selectedSuite.description && (
                  <p className="text-sm text-[#6c757d] mt-1">{selectedSuite.description}</p>
                )}
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-[#6c757d] hover:text-[#2b2f33]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-lg mb-3">Тест-кейсы в наборе</h3>
              <div className="space-y-2">
                {suiteTestCases.map((tcId) => {
                  const testCase = testCasesData.find(tc => tc.id === tcId);
                  if (!testCase) return null;
                  
                  return (
                    <div key={tcId} className="flex justify-between items-center p-3 bg-[#fff6fb] rounded-lg">
                      <div>
                        <p className="text-[#f19fb5]">{testCase.name}</p>
                        <p className="text-sm text-[#6c757d]">Статус: {testCase.status}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveTestCase(tcId)}
                        className="p-2 text-[#6c757d] hover:text-[#b12e4a] hover:bg-[#ffd7db] rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                {suiteTestCases.length === 0 && (
                  <p className="text-center text-[#6c757d] py-4">Нет тест-кейсов в наборе</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg mb-3">Доступные тест-кейсы</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {testCasesData
                  .filter(tc => !suiteTestCases.includes(tc.id))
                  .map((testCase) => (
                    <div key={testCase.id} className="flex justify-between items-center p-3 bg-[#f8f9fa] rounded-lg">
                      <div>
                        <p className="text-[#2b2f33]">{testCase.name}</p>
                        <p className="text-sm text-[#6c757d]">Статус: {testCase.status}</p>
                      </div>
                      <button
                        onClick={() => handleAddTestCase(testCase.id)}
                        className="p-2 text-[#6c757d] hover:text-[#28a745] hover:bg-[#d4edda] rounded-lg transition-all"
                        title="Добавить"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
