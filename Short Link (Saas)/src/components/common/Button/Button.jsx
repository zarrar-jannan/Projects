
export function Button({children = 'PROCEED',loadingText = null,...props}) {
  return (
    <>
    <button style={{cursor: `${ loadingText ? 'not-allowed' : 'pointer'}`}} {...props} >{loadingText ? loadingText : children}</button>
    </>
  )
}