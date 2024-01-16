import React from "react";
import DeepMetaLogo from "../../../public/logo_new_light.png";
import Image from "next/image";

const Appbar: React.FC = () => {
  return (
    <>
      <div className=" fixed z-10 flex h-16 w-full items-center  bg-slate-50 px-4 shadow-md">
        <Image
          src={DeepMetaLogo}
          alt="deep-meta-logo"
          height={27.8}
          width={150}
        />
      </div>
    </>
  );
};

export default Appbar;
