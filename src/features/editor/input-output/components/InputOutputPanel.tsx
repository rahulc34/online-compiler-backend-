import { Group, Panel, Separator } from "react-resizable-panels";

import InputPanel from "./InputPanel";
import OutputPanel from "./OutputPanel";

interface InputOutputPanelProps {
  input: string;
  setInput: (value: string) => void;
  output: string;
}

function InputOutputPanel({ input, setInput, output }: InputOutputPanelProps) {
  return (
    <Group orientation="vertical" className="h-full w-full min-h-0">
      <Panel defaultSize={50} minSize={50}>
        <InputPanel value={input} onChange={setInput} />
      </Panel>

      <Separator className="group relative z-10 flex h-2 shrink-0 cursor-row-resize items-center justify-center bg-transparent">
        <div className="h-[3px] w-12 rounded-full bg-[#363740] transition-colors group-hover:bg-blue-400 group-active:bg-blue-400" />
      </Separator>

      <Panel defaultSize={50} minSize={50}>
        <OutputPanel output={output} />
      </Panel>
    </Group>
  );
}

export default InputOutputPanel;
