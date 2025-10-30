import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as dotenv from 'dotenv';

export interface ConfigInterface {
  server_name: string;
  server_endpoints: {
    auth: string;
  };
}

export class ConfigLoader {
  private static instance: ConfigLoader;
  private config: ConfigInterface;

  private constructor() {
    dotenv.config();
    this.loadConfig();
  }

  public static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }
    return ConfigLoader.instance;
  }

  private loadConfig(): void {
    const env = process.env.ENV || '';

    if (env == '') {
      throw new Error('ENV environment variable is required but not set');
    }

    const configPath = path.join(process.cwd(), 'config', `config_${env}.yml`);

    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }

    try {
      let fileContents = fs.readFileSync(configPath, 'utf8');
      
      // Replace environment variables in the format ${ENV_}
      fileContents = fileContents.replace(/\$\{(ENV_\w+)\}/g, (match, envVar) => {
        const value = process.env[envVar];
        if (value === undefined) {
          throw new Error(`Environment variable ${envVar} is not defined`);
        }
        return value;
      });
      
      this.config = yaml.load(fileContents) as ConfigInterface;
      // console.debug('Loaded config:', JSON.stringify(this.config, null, 2));
    } catch (error) {
      throw new Error(`Failed to parse config file: ${error.message}`);
    }
  }

  public getConfig(): ConfigInterface {
    return this.config;
  }

  public get<K extends keyof ConfigInterface>(key: K): ConfigInterface[K] {
    return this.config[key];
  }
}

// Export singleton instance
export const config = ConfigLoader.getInstance();