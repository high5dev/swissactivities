import * as React from 'react';
import { Range, getTrackBackground } from 'react-range';
import styles from './styles.module.scss';

const STEP = 1;
const MIN = 0;
const MAX = 1250;

// Copy of TwoThumbs with `draggableTrack` prop added
class PriceRanger extends React.Component {
  state = {};

  onMouseDown = () => {}

  onTouchStart = () => {}

  onChangeValues = (values) => {
    this.props.filterByValues(values);
  }

  render() {
    return (
      <div className={styles.rangeContainer}>
        <output className={styles.output} id="output">
          {this.props.filterValues[0]} - {this.props.filterValues[1]}
        </output>
        <Range
          draggableTrack
          values={this.props.filterValues}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={this.onChangeValues}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={this.onMouseDown}
              onTouchStart={this.onTouchStart}
              style={{
                ...props.style,
                height: '36px',
                display: 'flex',
                width: '100%'
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: '5px',
                  width: '100%',
                  borderRadius: '4px',
                  background: getTrackBackground({
                    values: this.props.filterValues,
                    colors: ['#bfbfbf', '#FE504F', '#bfbfbf'],
                    min: MIN,
                    max: MAX
                  }),
                  alignSelf: 'center'
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '15px',
                width: '15px',
                borderRadius: '10px',
                backgroundColor: '#FE504F',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  height: '16px',
                  width: '5px',
                  backgroundColor: '#FF5176'
                }}
              />
            </div>
          )}
        />
      </div>
    );
  }
}

export default PriceRanger;