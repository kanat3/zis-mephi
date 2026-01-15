import { X } from 'lucide-react';
import type { Project, TestCase, TestPlan, TestSuite, User } from '../services/api';

// Edit Project Modal
export function EditProjectModal({
  project,
  onSave,
  onClose,
}: {
  project: Project;
  onSave: (updated: Project) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = React.useState(project);

  return (
    <div className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-[#f19fb5]">Редактировать проект</h2>
          <button onClick={onClose} className="text-[#6c757d] hover:text-[#2b2f33]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-[#2b2f33]">Название</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#2b2f33]">Ответственный</label>
            <input
              type="text"
              value={formData.responsible_name}
              onChange={(e) => setFormData({ ...formData, responsible_name: e.target.value })}
              className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#2b2f33]">Статус</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
            >
              <option value="active">Активный</option>
              <option value="pending">В ожидании</option>
              <option value="completed">Завершен</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
          >
            Отмена
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

// Set Completion Date Modal
export function SetCompletionDateModal({
  project,
  onSave,
  onClose,
}: {
  project: Project;
  onSave: (date: string) => void;
  onClose: () => void;
}) {
  const [date, setDate] = React.useState(project.completion_date || '');

  return (
    <div className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-[#f19fb5]">Установить дату срока</h2>
          <button onClick={onClose} className="text-[#6c757d] hover:text-[#2b2f33]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>
          <label className="block text-sm mb-2 text-[#2b2f33]">Дата завершения проекта</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
          >
            Отмена
          </button>
          <button
            onClick={() => onSave(date)}
            className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

// Edit Test Case Modal
export function EditTestCaseModal({
  testCase,
  onSave,
  onClose,
}: {
  testCase: TestCase;
  onSave: (updated: Partial<TestCase>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = React.useState({
    name: testCase.name,
    status: testCase.status,
    description: testCase.description || '',
    steps: testCase.steps || '',
    expected_result: testCase.expected_result || '',
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-[10px] p-8 max-w-[600px] w-[90%] shadow-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-[#f19fb5]">Редактировать тест-кейс</h2>
          <button onClick={onClose} className="text-[#6c757d] hover:text-[#2b2f33]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-[#2b2f33]">Название</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#2b2f33]">Статус</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
            >
              <option value="pending">Ожидает</option>
              <option value="passed">Пройден</option>
              <option value="failed">Провален</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#2b2f33]">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
              rows={3}
              placeholder="Описание тест-кейса"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#2b2f33]">Шаги выполнения</label>
            <textarea
              value={formData.steps}
              onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
              className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
              rows={4}
              placeholder="1. Шаг 1\n2. Шаг 2\n3. Шаг 3"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#2b2f33]">Ожидаемый результат</label>
            <textarea
              value={formData.expected_result}
              onChange={(e) => setFormData({ ...formData, expected_result: e.target.value })}
              className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
              rows={2}
              placeholder="Ожидаемый результат выполнения"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
          >
            Отмена
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

// Edit Test Plan Modal
export function EditTestPlanModal({
  testPlan,
  onSave,
  onClose,
}: {
  testPlan: TestPlan;
  onSave: (updated: Partial<TestPlan>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = React.useState({
    name: testPlan.name,
    goal: testPlan.goal,
    deadline: testPlan.deadline || '',
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-[#f19fb5]">Редактировать тест-план</h2>
          <button onClick={onClose} className="text-[#6c757d] hover:text-[#2b2f33]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-[#2b2f33]">Название</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#2b2f33]">Цель</label>
            <textarea
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#2b2f33]">Дедлайн</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
          >
            Отмена
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 px-6 py-3 rounded-lg bg-[#f19fb5] text-white hover:bg-[#e27091] transition-all"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

// Approve/Reject Test Plan Modal
export function ApproveRejectTestPlanModal({
  testPlan,
  onApprove,
  onReject,
  onClose,
}: {
  testPlan: TestPlan;
  onApprove: () => void;
  onReject: (comments: string) => void;
  onClose: () => void;
}) {
  const [comments, setComments] = React.useState('');
  const [mode, setMode] = React.useState<'view' | 'reject'>('view');

  return (
    <div className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-[#f19fb5]">Утвердить тест-план</h2>
          <button onClick={onClose} className="text-[#6c757d] hover:text-[#2b2f33]">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-[#6c757d] mb-2">Тест-план:</p>
          <p className="text-[#2b2f33]">{testPlan.name}</p>
        </div>

        {mode === 'reject' && (
          <div className="mb-6">
            <label className="block text-sm mb-2 text-[#2b2f33]">Комментарии к возврату</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-4 py-2 border border-[#e8e9ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f19fb5]"
              rows={4}
              placeholder="Укажите причины возврата..."
            />
          </div>
        )}

        <div className="flex gap-3">
          {mode === 'view' ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
              >
                Отмена
              </button>
              <button
                onClick={() => setMode('reject')}
                className="flex-1 px-6 py-3 rounded-lg bg-[#ffc107] text-white hover:bg-[#e0a800] transition-all"
              >
                Вернуть
              </button>
              <button
                onClick={onApprove}
                className="flex-1 px-6 py-3 rounded-lg bg-[#28a745] text-white hover:bg-[#218838] transition-all"
              >
                Утвердить
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setMode('view')}
                className="flex-1 px-6 py-3 rounded-lg border border-[#e8e9ea] text-[#2b2f33] hover:bg-[#f8f9fa] transition-all"
              >
                Назад
              </button>
              <button
                onClick={() => onReject(comments)}
                disabled={!comments.trim()}
                className="flex-1 px-6 py-3 rounded-lg bg-[#dc3545] text-white hover:bg-[#c82333] transition-all disabled:opacity-50"
              >
                Подтвердить возврат
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
