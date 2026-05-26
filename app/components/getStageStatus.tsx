import { FieldProps } from "formik";
import React from "react";

interface InputProps extends FieldProps {
  status: string,
  stage: string,
  index: number
}

const getStageNumber = (stage: string): number => {
  switch (stage) {
    case 'FileParsing':
      return 0
    case 'ReviewAndApproval':
      return 1
    case 'Process':
      return 2
    case 'Reorder':
      return 3
    case 'Calculations':
      return 4
    case 'Finalized':
      return 5
    default:
      return 0
  }
}

const getStageStatus = (status: string, stage: string, index: number) => {
  const _success = "text-green-400";
  const _current = "text-blue-500";
  const _default = "text-gray-400";
  const _danger = "text-red-600";

  switch (index) {
    case 0:
      if (getStageNumber(stage) == 0)
        return _current;
      else
        return _success;

    case 1: {
      if (getStageNumber(stage) > 1)
        return _success;

      if (getStageNumber(stage) == 1)
        if (status == 'Failed')
          return _danger;
        else
          return _current;
    }
    case 2: {
      if (getStageNumber(stage) > 2)
        return _success;

      if (getStageNumber(stage) == 2)
        return _current;
    }
    case 3: {
      if (getStageNumber(stage) > 3)
        return _success;

      if (getStageNumber(stage) == 3)
        return _current;
    }
    case 4: {
      if (getStageNumber(stage) > 4)
        return _success;

      if (getStageNumber(stage) == 4)
        return _current;
    }
    case 5:
      if (getStageNumber(stage) == 5) {
        if (status == 'Completed')
          return _success;
        if (status == 'CompletedWithErrors')
          return _danger;
        if (status == 'Failed')
          return _danger;
        if (status == 'Canceled')
          return _danger;
      }
    default:
      return _default;
  }
};

export default getStageStatus;
