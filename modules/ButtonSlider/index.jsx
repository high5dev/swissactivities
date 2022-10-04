import styles from './styles.module.scss';

const ButtonSlider = ({enabled, handler}) => {
    return (
        <div className={styles.body} onClick={handler}>
            <div style={{left: `${enabled ? 60 : 8}px`}} />
        </div>
    )
};

export default ButtonSlider;
