import * as React from "react";

interface ExperimentProps {
  title: string;
  count: number;
  description: string;
}

const ContentCard: React.FC<ExperimentProps> = ({
  title,
  count,
  description,
}) => (
  <div className="flex flex-col items-start gap-4 p-6 w-[1121px] rounded-[24px] bg-[#EDE7F6]">
    <div className="flex flex-col items-start self-stretch">
      <h2 className="text-lg font-semibold text-[#558B2F]">{title}</h2>
      <p className="text-sm font-medium text-[#333]">{count} performed</p>
    </div>
    <p className="text-base text-[#333] leading-relaxed">{description}</p>
  </div>
);

export default ContentCard;
