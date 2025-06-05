import EmailBar from './_components/email-bar'
import EmailViewer from './_components/view-email'

function page() {
    return (
        <div className=' grow grid grid-cols-[300px_auto] border-1  overflow-hidden rounded-md'>
            <EmailBar />
            <div className=''>
                <EmailViewer email={{
                    from: "williamsmith@example.com",
                    subject: 'Meeting Tomorrow',
                    date: new Date(),
                    text: "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates."
                }} />
            </div>
        </div>
    )
}

export default page
