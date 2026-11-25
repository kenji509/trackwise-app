import { useEffect, useRef, useState } from 'react'
import { formatDateTime, levelThresholds } from '../progressData.js'
import './ScoreTrend.css'

const HEIGHT = 220
const PAD = { top: 30, right: 28, bottom: 34, left: 46 }
const TICKS = [0, ...levelThresholds().sort((a, b) => a - b), 100]
const TOOLTIP_HALF = 96

function ScoreTrend({ points }) {
  const frameRef = useRef(null)
  const [width, setWidth] = useState(560)
  const [active, setActive] = useState(null)

  useEffect(() => {
    const frame = frameRef.current
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(200, Math.round(entry.contentRect.width))))
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  const plotWidth = Math.max(width - PAD.left - PAD.right, 1)
  const plotHeight = HEIGHT - PAD.top - PAD.bottom
  const count = points.length
  const x = (index) => PAD.left + (count > 1 ? (index * plotWidth) / (count - 1) : plotWidth / 2)
  const y = (percent) => PAD.top + plotHeight * (1 - percent / 100)

  const line = points.map((point, index) => `${index ? 'L' : 'M'}${x(index)},${y(point.percent)}`).join(' ')
  const area = count > 1 ? `${line} L${x(count - 1)},${y(0)} L${x(0)},${y(0)} Z` : ''
  const last = points[count - 1]
  const current = active === null ? null : points[active]

  function pickNearest(clientX) {
    const left = frameRef.current.getBoundingClientRect().left
    const pointerX = clientX - left
    let nearest = 0
    points.forEach((_, index) => {
      if (Math.abs(x(index) - pointerX) < Math.abs(x(nearest) - pointerX)) nearest = index
    })
    setActive(nearest)
  }

  function handleKeyDown(event) {
    const moves = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActive(event.key === 'Home' ? 0 : count - 1)
    } else if (Object.hasOwn(moves, event.key)) {
      event.preventDefault()
      setActive((index) => Math.min(count - 1, Math.max(0, (index ?? count - 1) + moves[event.key])))
    } else if (event.key === 'Escape') {
      setActive(null)
    }
  }

  const summary = `Scores of your last ${count === 1 ? 'quiz' : `${count} quizzes`}, oldest to newest: ${points
    .map((point) => `${point.percent}%`)
    .join(', ')}.`
  const tooltipLeft = current ? Math.min(Math.max(x(active), TOOLTIP_HALF), width - TOOLTIP_HALF) : 0

  return (
    <section className="score-trend" aria-labelledby="score-trend-title">
      <div className="score-trend__head">
        <h3 id="score-trend-title" className="score-trend__title">
          Score trend
        </h3>
        <p className="score-trend__sub">
          {count === 1 ? 'Your only quiz so far' : `Your last ${count} quizzes, oldest to newest`}
        </p>
      </div>

      <div
        ref={frameRef}
        className="score-trend__frame"
        role="group"
        tabIndex={0}
        aria-label={`${summary} Use the arrow keys to read each quiz.`}
        onPointerMove={(event) => pickNearest(event.clientX)}
        onPointerDown={(event) => pickNearest(event.clientX)}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setActive(null)
        }}
        onFocus={(event) => {
          if (event.currentTarget.matches(':focus-visible')) setActive(count - 1)
        }}
        onBlur={() => setActive(null)}
        onKeyDown={handleKeyDown}
      >
        <svg className="score-trend__svg" viewBox={`0 0 ${width} ${HEIGHT}`} width="100%" height={HEIGHT} aria-hidden="true">
          {TICKS.map((tick) => (
            <g key={tick}>
              <line className="score-trend__grid" x1={PAD.left} x2={PAD.left + plotWidth} y1={y(tick)} y2={y(tick)} />
              <text className="score-trend__tick" x={PAD.left - 10} y={y(tick)} textAnchor="end" dominantBaseline="middle">
                {tick}%
              </text>
            </g>
          ))}

          {points.map((point, index) => (
            <text key={point.attemptId} className="score-trend__tick" x={x(index)} y={HEIGHT - 10} textAnchor="middle">
              #{point.number}
            </text>
          ))}

          {area && <path className="score-trend__area" d={area} />}
          {count > 1 && <path className="score-trend__line" d={line} />}

          {current && (
            <line className="score-trend__crosshair" x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + plotHeight} />
          )}

          {points.map((point, index) => (
            <circle
              key={point.attemptId}
              className="score-trend__dot"
              cx={x(index)}
              cy={y(point.percent)}
              r={index === active ? 6 : 4.5}
            />
          ))}

          {active !== count - 1 && (
            <text className="score-trend__end" x={x(count - 1)} y={y(last.percent) - 14} textAnchor="middle">
              {last.percent}%
            </text>
          )}
        </svg>

        {current && (
          <div className="score-trend__tooltip" style={{ left: tooltipLeft, top: y(current.percent) }} aria-hidden="true">
            <strong className="score-trend__tooltip-value">{current.percent}%</strong>
            <span className="score-trend__tooltip-title">{current.title}</span>
            <span className="score-trend__tooltip-meta">
              {current.score} / {current.total} · {formatDateTime(current.submittedAt)}
            </span>
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {current
          ? `Quiz number ${current.number}, ${current.title}: ${current.percent}%, ${current.score} of ${current.total} correct, ${formatDateTime(current.submittedAt)}.`
          : ''}
      </p>
      <p className="score-trend__note">The 50% and 80% lines mark where Needs practice and Strong begin.</p>
    </section>
  )
}

export default ScoreTrend
