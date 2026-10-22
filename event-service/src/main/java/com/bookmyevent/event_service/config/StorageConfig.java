package com.bookmyevent.event_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

/**
 * Points the AWS S3 SDK at MinIO. The presigner only signs upload links locally;
 * it never connects to MinIO, so the endpoint is the browser-facing address.
 */
@Configuration
public class StorageConfig {

    @Bean
    public S3Presigner s3Presigner(@Value("${storage.endpoint}") String endpoint,
                                   @Value("${storage.region}") String region,
                                   @Value("${storage.access-key}") String accessKey,
                                   @Value("${storage.secret-key}") String secretKey) {
        return S3Presigner.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                // MinIO addresses buckets as host/bucket/key, not bucket.host/key
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)
                        .build())
                .build();
    }
}
