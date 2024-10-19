const Header = () => {
  return (
    <div className="w-full md:py-10 py-3 absolute top-0 left-0 right-0 flex items-center justify-between px-10">
      <div className="text-[#EE10B0]">Music Box</div>
      <div className="flex gap-5">
        <span className="hover:bg-[#EE10B0] w-[9vw] hover:text-white active:bg-white active:text-[#EE10B0] text-center md:px-7 md:py-3 px-3 py-1 md:text-base text-sm rounded cursor-pointer border border-[#EE10B0] text-[#EE10B0] transition duration-500">
          Login
        </span>
        <span className="hover:bg-[#EE10B0] w-[9vw] hover:text-white active:bg-white active:text-[#EE10B0] text-center md:px-7 md:py-3 px-3 py-1 md:text-base text-sm rounded cursor-pointer border border-[#EE10B0] text-[#EE10B0] transition duration-500">
          Register
        </span>
        <span className="hover:bg-[#EE10B0] w-[9vw] hover:text-white active:bg-white active:text-[#EE10B0] text-center md:px-7 md:py-3 px-3 py-1 md:text-base text-sm rounded cursor-pointer border border-[#EE10B0] text-[#EE10B0] transition duration-500">
          connect wallet
        </span>
      </div>
    </div>
  );
};

export default Header;
