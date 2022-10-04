import { Card } from "./index";
import { Loader } from "../Loader";

export const CardLoader = () => {
  return (
    <Card>
      <div className={`flex min-h-[200px] items-center justify-center`}>
        <Loader />
      </div>
    </Card>
  );
};
