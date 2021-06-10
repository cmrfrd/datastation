import * as React from 'react';

import { ProjectState, ProjectPage, PanelResult } from './../shared/state';

import { evalPanel } from './Panel';
import { Page } from './Page';
import { Button } from './component-library/Button';
import { Input } from './component-library/Input';

export function Pages({
  state,
  addPage,
  updatePage,
  setCurrentPage,
  currentPage,
}: {
  state: ProjectState;
  addPage: (page: ProjectPage) => void;
  updatePage: (page: ProjectPage) => void;
  setCurrentPage: (pageIndex: number) => void;
  currentPage: string;
}) {
  const page = state.pages[currentPage];
  const [panelResults, setPanelResults] = React.useState<
    Array<Array<PanelResult>>
  >([]);
  // Reset results when project changes
  React.useEffect(() => {
    setPanelResults([]);
  }, [state.id]);

  async function reevalPanel(panelIndex: number) {
    if (!panelResults[currentPage]) {
      panelResults[currentPage] = [];
    }

    try {
      const r = await evalPanel(page, panelIndex, panelResults[currentPage]);
      panelResults[currentPage][panelIndex] = { lastRun: new Date(), value: r };
    } catch (e) {
      panelResults[currentPage][panelIndex] = {
        lastRun: new Date(),
        exception: e.stack,
      };
    } finally {
      setPanelResults({ ...panelResults });
    }
  }

  return (
    <div className="section pages">
      <div className="section-title">
        <Input
          className="page-name page-name--current"
          onChange={(value: string) => updatePage({ ...page, name: value })}
          value={page.name}
        />
        {state.pages.map((page: ProjectPage, i: number) =>
          i === currentPage ? undefined : (
            <Button className="page-name" onClick={() => setCurrentPage(i)}>
              {page.name}
            </Button>
          )
        )}
        <Button
          type="primary"
          className="flex-right"
          onClick={() => {
            addPage({ name: 'Untitled page', panels: [] });
            setCurrentPage(state.pages.length - 1);
          }}
        >
          New Page
        </Button>
      </div>

      <Page page={page} updatePage={updatePage} reevalPanel={reevalPanel} />
    </div>
  );
}
