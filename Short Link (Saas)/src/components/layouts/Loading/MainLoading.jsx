import { motion } from 'framer-motion'

export function MainLoading() {


  return (
    <div className='h-screen w-full bg-black flex items-center justify-center'>
      <motion.div
        className="w-12 h-12 bg-white flex items-center justify-center"
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 360, 360, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1
        }}
      >
        <img className='w-8' src="/images/ani-card-images/link-icon.png" alt="LINK" />
      </motion.div>

    </div>
  )
}

