interface Props {
  status: string;
}

export default function StatusBar({ status }: Props) {
  return (
    <div className="h-8 border-t border-zinc-800 px-4 flex items-center text-sm">
      Status :<span className="ml-2 text-green-400">{status}</span>
    </div>
  );
}
