import{
    Html,
    Head,
    Font,
    Row,
    
    Preview,
    Heading,
    Text,
    Section,
    Button

} from '@react-email/components';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderToString } from 'react-dom/server';

interface VerificationEmailProps{
    username: string;
    otp: string;
}


export default function VerificationEmail({username,otp}:VerificationEmailProps){

    return (
        <Html>
            <Head>
               <title>Verification Code </title>
                <Font
                    fontFamily = "Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
                        format: 'truetype',
                    }}

                />
                
            </Head>
            <Preview>Verify your account</Preview>
            <body>
                <Section
                    style={{
                        backgroundColor: '#f4f4f4',
                        padding: '20px',
                    }}
                >
                    <Heading
                        style={{
                            fontSize: '26px',
                            fontWeight: '700',
                            marginBottom: '10px',
                        }}
                    >
                        Verify your account
                    </Heading>
                    <Text
                        style={{
                            fontSize: '16px',
                            marginBottom: '10px',
                        }}
                    >
                        Hey {username}, please use the code below to verify your
                        account.
                    </Text>
                    <Text
                        style={{
                            fontSize: '16px',
                            marginBottom: '10px',
                        }}
                    >
                        {otp}
                    </Text>
                </Section>
            </body>
        </Html>
    );

}