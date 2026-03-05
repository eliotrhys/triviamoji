import Link from "next/link";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar(props: NavbarProps) {

  const handleClose = () => {
    props.onMenuToggle();
  };

  return (
    <div className="">
      <div className="px-4 pt-0 lg:pt-4 flex items-center justify-between">
        <div>
          <Link href="/">
            <img alt="Horizontal Logo" className="horizontalLogo" src="/images/horizontalLogo.png" />
          </Link>
        </div>
          <div>
            <button className="flex items-center" onClick={handleClose}>
              <div className="border-2 lg:border-4 border-black text-black bg-white hover:text-white hover:bg-blue-500 h-5 w-5 lg:h-10 lg:w-10 p-2 flex items-center justify-center text-sm lg:text-xl rounded-full ease-in-out duration-100 mr-2 lift">{"<"}</div>
              <div className="text-xs md:text-sm lg:text-lg">Options</div>
            </button>
          </div>
      </div>
    </div>
  )
}
