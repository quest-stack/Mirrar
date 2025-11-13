import React from 'react';
import { useUIStore } from './store/uiStore';
import Home from './pages/Home';
import TemplateSelector from './pages/TemplateSelector';
import TestCreate from './pages/TestCreate';
import TestEdit from './pages/TestEdit';
import TestResult from './pages/TestResult';
import Notifications from './components/Notifications';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const { currentView } = useUIStore();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'template-select':
        return <TemplateSelector />;
      case 'test-create':
        return <TestCreate />;
      case 'test-edit':
        return <TestEdit />;
      case 'test-result':
        return <TestResult />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {renderView()}
      <Notifications />
      <LoadingOverlay />
    </div>
  );
};

export default App;
