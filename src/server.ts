import { Server } from 'http';
import app from './app';
import { env } from './app/config/env';
import { seed } from './app/shared/seed';



async function bootstrap() {
    let server: Server;

    try {
        // Start the server
        server = app.listen(env.port, () => {
            console.log(`✅ Multi-Tenant Organization API is running on http://localhost:${env.port}`);
            console.log(`Environment: ${env.node_env}`);
        });

        // Function to gracefully shut down the server
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log('Server closed gracefully.');
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        };

        await seed();

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (error) => {
            console.log('❌ Unhandled Rejection detected. Closing server...');
            if (server) {
                server.close(() => {
                    console.error(error);
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.log('❌ Uncaught Exception detected. Exiting...');
            console.error(error);
            process.exit(1);
        });
    } catch (error) {
        console.error('❌ Error during server startup:', error);
        process.exit(1);
    }
}

bootstrap();
