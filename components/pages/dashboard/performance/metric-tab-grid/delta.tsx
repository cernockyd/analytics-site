import { DeltaType } from 'lib/utils';
import {
  ArrowDownIcon,
  ArrowDownRightIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  ArrowRightIcon,
} from '@heroicons/react/20/solid';

type Props = {
  type: DeltaType;
  text: string;
};

const iconMap: { [key: string]: React.ElementType } = {
  [DeltaType.Increase]: ArrowUpIcon,
  [DeltaType.ModerateIncrease]: ArrowUpRightIcon,
  [DeltaType.Decrease]: ArrowDownIcon,
  [DeltaType.ModerateDecrease]: ArrowDownRightIcon,
  [DeltaType.Unchanged]: ArrowRightIcon,
};

export default function Delta({ type, text }: Props) {
  const Icon = iconMap[type];
  return (
    <span
      className={`text-current flex-shrink-0 inline-flex justify-center items-center text-sm`}
    >
      <Icon className="h-4 w-4 -ml-1 mr-.5" />
      {text ? <p className="whitespace-nowrap">{text}</p> : null}
    </span>
  );
}
