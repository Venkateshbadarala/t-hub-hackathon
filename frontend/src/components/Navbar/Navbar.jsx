import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import DarkModeToggle from './ThemeSwitch';
import AccountImage from './AccountImage';



const Navbar = () => {

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 20) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

 

  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: '-145%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed z-50 flex flex-col"
    >
      <div className="flex flex-row items-center justify-around font-bold text-white bg-black sm:p-4 rounded-[2px] w-[100vw]  ">
        <div className="x-sm:w-[14rem] sm:w-[20rem] ">
          <h1 className='text-[1.6rem] font-serif ' >Emo-Diary</h1>
        </div>
       <div className='flex items-center justify-between gap-10 '>
       <div>
       <DarkModeToggle/>
       </div>
        <div>
        <AccountImage/>
       </div>
       </div>
      
        
      </div>
    </motion.div>
  );
};

export default Navbar;
