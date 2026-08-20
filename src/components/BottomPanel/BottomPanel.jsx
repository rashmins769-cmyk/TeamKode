import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { BottomPanelTabs } from './BottomPanelTabs';
import { TerminalView } from './TerminalView';
import { PreviewView } from './PreviewView';
import { OutputView } from './OutputView';
import { EmptyView } from './EmptyView';

export const BottomPanel = () => {
  const { bottomPanelTab } = useEditor();

  const show = (tab) => ({
    display: bottomPanelTab === tab ? 'flex' : 'none',
    flex: 1,
    overflow: 'hidden',
    flexDirection: 'column',
    minHeight: 0,
  });

  return (
    <div className="bottom-panel bg-[#1e1e1e] flex flex-col h-full relative border-t border-[#2d2d2d]">
      <BottomPanelTabs />

      <div className="flex-1 overflow-hidden min-h-0 flex flex-col" style={{ position: 'relative' }}>

        {/* Always keep TerminalView mounted — hide via CSS to preserve shell process */}
        <div style={show('terminal')}>
          <TerminalView isActive={bottomPanelTab === 'terminal'} />
        </div>

        <div style={show('output')}>
          <OutputView />
        </div>

        <div style={show('preview')}>
          <PreviewView />
        </div>

        {!['terminal', 'output', 'preview'].includes(bottomPanelTab) && (
          <div style={{ display: 'flex', flex: 1 }}>
            <EmptyView tabName={bottomPanelTab} />
          </div>
        )}
      </div>
    </div>
  );
};
