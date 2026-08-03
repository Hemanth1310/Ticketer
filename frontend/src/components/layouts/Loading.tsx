
const Loading = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-5'>
       <div className="w-10 h-10 border-4 border-brand-forth border-t-brand-primary rounded-full animate-spin" />
       <p className='text-2xl text-mist-500'>Loading . please wait!!</p>
    </div>
  )
}

export default Loading