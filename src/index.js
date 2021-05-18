import React, { useState } from 'react'
import styles from './styles.module.css'

export const DistributionPlotComponent = (props) => {
  // min max weight score
  const [bins, setBins] = useState(
    props.bins ?? [
      [0, 1, 0.3, 50],
      [1, 3.333, 0.6, 300],
      [3.33333, 5, 0.2, 900]
    ]
  )

  const categorical = props.categorical ?? false
  const cwidth = props.width ?? 1200
  const cheight = props.height ?? 400
  const nbins = bins.length < 10 ? 10 : bins.length
  const minscore = bins.reduce((accum, bin) => {
    const score = Number(bin[3])
    if (score < accum) return score
    else return accum
  }, Number(bins[0][3]))
  let maxscore = bins.reduce((accum, bin) => {
    const score = Number(bin[3])
    if (score > accum) return score
    else return accum
  }, Number(bins[0][3]))

  if (maxscore === minscore) maxscore = minscore + 1

  const rescaler = (val) => {
    return ((Number(val) - minscore) / (maxscore - minscore)) * cheight
  }

  const onChangeFiled = (value, idx, field) => {
    const regexalpha = new RegExp('^[a-zA-Z0-9]+$')
    const regexnum = new RegExp('^[.0-9]+$')

    if (categorical && field === 0) {
      if (regexalpha.test(value)) {
        bins[idx][field] = value
        props.callback && props.callback([...bins])
        setBins([...bins])
      }
      return
    }

    if (regexnum.test(value)) {
      bins[idx][field] = value
      props.callback && props.callback([...bins])
      setBins([...bins])
    }
  }

  const onDelete = (idx) => {
    if (bins.length > 1) {
      bins.splice(idx, 1)
      props.callback && props.callback([...bins])
      setBins([...bins])
    }
  }

  const onSplit = (idx) => {
    const bin = bins[idx]
    const newbin = [...bin]

    if (categorical) {
      newbin[0] = `${newbin[0]} copy`
    } else {
      newbin[0] = Number(bin[0]) + Number(bin[1]) / 2
      bin[1] = newbin[0]
    }

    bin[2] = Number(bin[2]) / 2
    newbin[2] = Number(newbin[2]) / 2

    bins.splice(idx + 1, 0, newbin)
    props.callback && props.callback([...bins])
    setBins([...bins])
  }

  return (
    <div className={styles.container} style={{ width: cwidth }}>
      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${nbins}, ${Math.round(
            100.0 / nbins
          )}%)`,
          gridTemplateRows: `${cheight}px 80px`,
          justifyContent: 'stretch',
          alignItems: 'end',
          padding: '4px',
          gridColumnGap: '0px',
          background: '#2380B6'
        }}
      >
        {/* bars */}
        {bins.map((bin, idx) => {
          return (
            <div
              key={idx}
              style={{
                background: '#62AFE8',
                gridArea: `1 / ${idx + 1} / 2 / ${idx + 2}`,
                height: `${Number(bin[2]) * cheight}px`,
                margin: '0 2px 0 2px'
              }}
            />
          )
        })}

        {/* lines and dots */}
        <div
          style={{
            position: 'absolute',
            width: `${cwidth - 8}px`,
            height: `${cheight}px`,
            top: '16px',
            left: '16px'
          }}
        >
          <svg
            viewBox={`0 0 ${cwidth - 8} ${cheight}`}
            xmlns='http://www.w3.org/2000/svg'
          >
            {bins.map((bin, idx) => {
              const offs = (cwidth - 8) / nbins
              if (idx === 0) {
                return
              }
              const x1 = (idx - 1) * offs + offs / 2
              const y1 = cheight + 2 - rescaler(bins[idx - 1][3])
              const x2 = idx * offs + offs / 2
              const y2 = cheight + 2 - rescaler(bin[3])

              return (
                <g key={idx}>
                  <line
                    key={idx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    strokeWidth='4'
                    stroke='#98E1FF'
                  />
                  <circle cx={x1} cy={y1} r='5' />
                </g>
              )
            })}
            <circle
              cx={(bins.length - 1 + 0.5) * ((cwidth - 8) / nbins)}
              cy={cheight + 2 - rescaler(bins[bins.length - 1][3])}
              r='5'
            />
          </svg>
        </div>

        {/* labels */}
        {bins.map((bin, idx) => {
          return (
            <div
              key={idx}
              style={{
                gridArea: `2 / ${idx + 1} / 3 / ${idx + 2}`,
                transformOrigin: '0 0',
                justifySelf: 'center',
                alignSelf: 'center'
              }}
            >
              <div
                className={styles.barlabel}
                style={{
                  display: 'inline-block',
                  transform: 'translate(0%, 0%) rotate(-90deg)'
                }}
              >
                {categorical ? `${bin[0]}` : `${bin[0]}-${bin[1]}`}
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.label}>
        <div>Specification</div>
      </div>

      <div className={styles.row}>
        <div
          className={styles.columnlabel}
          style={{ flexBasis: '15%', textAlign: 'center' }}
        >
          {categorical ? 'Category' : 'Min'}
        </div>

        {categorical || (
          <div
            className={styles.columnlabel}
            style={{ flexBasis: '15%', textAlign: 'center' }}
          >
            Max
          </div>
        )}
        <div
          className={styles.columnlabel}
          style={{ flexBasis: '15%', textAlign: 'center' }}
        >
          Weight
        </div>
        <div
          className={styles.columnlabel}
          style={{ flexBasis: '15%', textAlign: 'center' }}
        >
          Score
        </div>
        <div
          className={styles.columnlabel}
          style={{ flexBasis: '48px', textAlign: 'center' }}
        >
          Split
        </div>
        <div
          className={styles.columnlabel}
          style={{ flexBasis: '48px', textAlign: 'center' }}
        >
          Delete
        </div>
      </div>

      {/**************************************************************************************/}

      {bins.map((bin, idx) => {
        return (
          <div key={idx} className={styles.row}>
            <div style={{ flexBasis: '15%', textAlign: 'center' }}>
              <input
                className={styles.input}
                value={bin[0]}
                onChange={(e) => onChangeFiled(e.target.value, idx, 0)}
              />
            </div>
            {categorical || (
              <div style={{ flexBasis: '15%', textAlign: 'center' }}>
                <input
                  className={styles.input}
                  value={bin[1]}
                  onChange={(e) => onChangeFiled(e.target.value, idx, 1)}
                />
              </div>
            )}
            <div style={{ flexBasis: '15%', textAlign: 'center' }}>
              <input
                className={styles.input}
                value={bin[2]}
                onChange={(e) => onChangeFiled(e.target.value, idx, 2)}
              />
            </div>
            <div style={{ flexBasis: '15%', textAlign: 'center' }}>
              <input
                className={styles.input}
                value={bin[3]}
                onChange={(e) => onChangeFiled(e.target.value, idx, 3)}
              />
            </div>
            <div
              className={styles.button}
              style={{ flexBasis: '48px', textAlign: 'center' }}
              onClick={() => onSplit(idx)}
            >
              <svg
                width='25'
                height='21'
                viewBox='0 0 25 21'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect
                  x='4.56934'
                  y='7.58691'
                  width='20'
                  height='6'
                  fill='#219653'
                />
                <rect
                  x='0.463379'
                  y='10.99'
                  width='14.8348'
                  height='6'
                  transform='rotate(-47.5408 0.463379 10.99)'
                  fill='#219653'
                />
                <rect
                  x='4.6084'
                  y='6.69507'
                  width='14.2929'
                  height='6'
                  transform='rotate(44.1395 4.6084 6.69507)'
                  fill='#219653'
                />
              </svg>
            </div>
            <div
              className={styles.button}
              style={{ flexBasis: '48px', textAlign: 'center' }}
              onClick={() => onDelete(idx)}
            >
              <svg
                width='21'
                height='7'
                viewBox='0 0 21 7'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect x='0.5' y='0.5' width='20' height='6' fill='#EB5757' />
              </svg>
            </div>
          </div>
        )
      })}
    </div>
  )
}
