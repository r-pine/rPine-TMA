import * as motion from "motion/react-client"
import styles from "./LoadingThreeDotsJumping.module.css"

function LoadingThreeDotsJumping() {
	const MotionDiv = motion.div;

	return (
		<div className={styles.container}>
			<MotionDiv
				className={styles.dot}
				animate={{ y: [-10, 0] }}
				transition={{
					duration: 0.8,
					repeat: Infinity,
					repeatType: "reverse",
					ease: "easeInOut",
					delay: 0
				}}
			/>
			<MotionDiv
				className={styles.dot}
				animate={{ y: [-10, 0] }}
				transition={{
					duration: 0.8,
					repeat: Infinity,
					repeatType: "reverse",
					ease: "easeInOut",
					delay: 0.2
				}}
			/>
			<MotionDiv
				className={styles.dot}
				animate={{ y: [-10, 0] }}
				transition={{
					duration: 0.8,
					repeat: Infinity,
					repeatType: "reverse",
					ease: "easeInOut",
					delay: 0.4
				}}
			/>
		</div>
	)
}

export default LoadingThreeDotsJumping
