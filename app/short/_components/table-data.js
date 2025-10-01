import copyIcon from '@/app/assets/icons/copy.png'


export default function TableData({ preferedText, id, forShortUrl, url }) {
    function handleCopyClick(val) {
        navigator.clipboard.writeText(val)
    }
    return (
        <td className="outline-1 outline-white pt-2 pb-2">
            <div className='flex gap-3 justify-center'>
                <a href={forShortUrl ? `http://localhost:4000/${id}/${preferedText}` : url}>      {preferedText}
                </a>
                <img onClick={() => handleCopyClick(forShortUrl ? `http://localhost:4000/${id}/${preferedText}` : url)} src={copyIcon.src} className='cursor-pointer' width={20} alt="" />
            </div>
        </td>
    )
}