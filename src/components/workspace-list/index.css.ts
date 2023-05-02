import { style } from '@vanilla-extract/css'

export const containerStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  padding: '20px',
  justifyContent: 'flex-start',
})

export const cardStyle = style({
  width: '200px',
  height: '150px',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'all 0.2s ease-in-out'
})
