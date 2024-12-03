import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.svg";
import { MotionConfig, motion } from "framer-motion";
import { useState } from "react";
import { 
  SignIn,
  UserCirclePlus,
  House
} from "@phosphor-icons/react";

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};

/**
 * @param {Object} props
 * @param {string} props.text 
 * @param {React.ElementType} props.Icon
 * @param {Function} props.setOpen 
 */
const Option = ({ text, Icon, setOpen, link }) => {
  return (
    <Link to={link}>
    <motion.li
      variants={itemVariants}
      onClick={() => setOpen(false)}
      className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-green-100 text-slate-700 hover:text-green-500 transition-colors cursor-pointer"
    >
      <motion.span variants={actionIconVariants}>
        <Icon />
      </motion.span>
      <span>{text}</span>
    </motion.li>
    </Link>
  );
};

/**
 * @param {Object} props
 * @param {boolean} props.open 
 * @param {Function} props.setOpen 
 */
const StaggeredDropDown = ({ open, setOpen }) => {
    return (
      <motion.div
        animate={open ? "open" : "closed"}
        className="absolute z-50 right-[142px]"
      >
        <motion.ul
          initial="closed"
          animate={open ? "open" : "closed"}
          variants={wrapperVariants}
          style={{ originY: "top", left: "-50px" }}
          className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-3D absolute top-[120%] w-48 overflow-hidden"
        >
          <Option link={"/"} setOpen={setOpen} Icon={House} text="Home" />
          <Option link={"/login"} setOpen={setOpen} Icon={SignIn} text="Login" />
          <Option link={"/cadastroPsicologo"} setOpen={setOpen} Icon={UserCirclePlus} text="Cadastro" />
        </motion.ul>
      </motion.div>
    );
  };
  

/**
 * @returns {JSX.Element}
 */
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <nav className="max-w-[1440px] mx-auto flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-x-8">
          <img src={Logo} alt="Logo" width={40} height={40} />
          <h1 className="hidden sm:block text-xl  font-semibold" >MyPeace.</h1>
        </div>
        <div className="relative">
          <AnimatedHamburgerButton active={menuOpen} setActive={setMenuOpen} />
          {menuOpen && <StaggeredDropDown open={menuOpen} setOpen={setMenuOpen} />}
        </div>
      </nav>
    </header>
  );
};

/**
 * @param {Object} props
 * @param {boolean} props.active 
 * @param {Function} props.setActive 
 * @returns {JSX.Element}
 */
const AnimatedHamburgerButton = ({ active, setActive }) => {
  return (
    <MotionConfig
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <motion.button
        initial={false}
        animate={active ? "open" : "closed"}
        onClick={() => setActive((pv) => !pv)}
        className="relative h-20 w-20 rounded-full bg-white/0 transition-colors hover:bg-gray-100"
      >
        <motion.span
          variants={VARIANTS.top}
          className="absolute h-1 w-10 bg-black"
          style={{ y: "-50%", left: "50%", x: "-50%", top: "35%" }}
        />
        <motion.span
          variants={VARIANTS.middle}
          className="absolute h-1 w-10 bg-black"
          style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
        />
        <motion.span
          variants={VARIANTS.bottom}
          className="absolute h-1 w-5 bg-black"
          style={{
            x: "-50%",
            y: "50%",
            bottom: "35%",
            left: "calc(50% + 10px)",
          }}
        />
      </motion.button>
    </MotionConfig>
  );
};

const VARIANTS = {
  top: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      top: ["35%", "50%", "50%"],
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      top: ["50%", "50%", "35%"],
    },
  },
  middle: {
    open: {
      rotate: ["0deg", "0deg", "-45deg"],
    },
    closed: {
      rotate: ["-45deg", "0deg", "0deg"],
    },
  },
  bottom: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      bottom: ["35%", "50%", "50%"],
      left: "50%",
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      bottom: ["50%", "50%", "35%"],
      left: "calc(50% + 10px)",
    },
  },
};

export default Header;
