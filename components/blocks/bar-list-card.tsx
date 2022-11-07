import { useState, useRef } from 'react';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import Modal from 'components/blocks/modal-data';
import BarList, { Props as BarListProps } from 'components/blocks/bar-list';
import Title from 'components/text/title';
import Card from './card';
import { OverlayContainer, useButton, AriaButtonProps } from 'react-aria';

interface Props extends BarListProps {
  title: string;
  percentage?: boolean;
}

function FloatingButton(props: AriaButtonProps<'button'>) {
  const ref = useRef();
  const { buttonProps } = useButton(props, ref);
  const { children } = props;

  return (
    <button
      {...buttonProps}
      ref={ref}
      className="flex-shrink-0 inline-flex items-center font-medium focus:outline-none focus:ring-none text-sm text-gray-500 hover:text-gray-700 bg-white px-3 py-1.5 rounded-full border shadow-md ring-1 ring-gray-200 hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

export default function BarListCard({
  title,
  data,
  nameTitle,
  valueTitle,
  percentage = false,
}: Props) {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <Card className="p-6">
      <div>
        <Title>{title}</Title>
        {showDetail && (
          <OverlayContainer>
            <Modal
              title={title}
              onClose={() => setShowDetail(false)}
              isOpen={showDetail}
            >
              <BarList
                nameTitle={nameTitle}
                valueTitle={valueTitle}
                data={data}
                percentage={percentage}
              />
            </Modal>
          </OverlayContainer>
        )}
        <BarList
          nameTitle={nameTitle}
          valueTitle={valueTitle}
          data={data?.slice(0, 6)}
          percentage={percentage}
        />
        {data && data.length > 4 && (
          <div className="flex absolute inset-x-0 bottom-6 bg-gradient-to-t from-white w-full justify-center items-center px-6 pt-24">
            <FloatingButton onPress={() => setShowDetail(true)}>
              <ArrowsPointingOutIcon className="w-5 h-5 mr-1.5 -ml-0.5" />{' '}
              Explore
            </FloatingButton>
          </div>
        )}
      </div>
    </Card>
  );
}
