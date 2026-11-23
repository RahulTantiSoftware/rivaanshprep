package com.rivaanshprep.service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

import java.io.InputStream;
import java.net.URI;
import java.util.List;

@Service
public class CloudflareR2Service {

    private static final Logger log = LoggerFactory.getLogger(CloudflareR2Service.class);

    @Value("${cloudflare.r2.endpoint:https://9c6e8d481ebdbbb383ab06fa35991a66.r2.cloudflarestorage.com}")
    private String endpoint;

    @Value("${cloudflare.r2.access-key-id:4fe33a10f8439eb2e3386e91ecd1c4f5}")
    private String accessKeyId;

    @Value("${cloudflare.r2.secret-access-key:aad1c8e96c9f4381d46731315ea8c550a05182c3422584f5e0e3d723159a0945}")
    private String secretAccessKey;

    @Value("${cloudflare.r2.bucket:rivaanshprep}")
    private String bucket;

    private S3Client s3Client;

    private static final List<String> CANDIDATE_PREFIXES = List.of(
            "Chapters/",
            "ncert_class10_math/Chapters/",
            "ncert_class10_math/",
            "ncert_class10_science/Chapters/",
            "ncert_class10_science/",
            "ncert_class10_social_science/Chapters/",
            "ncert_class10_social_science/",
            "ncert_class10_english/Chapters/",
            "ncert_class10_english/",
            "ncert_class10_hindi/Chapters/",
            "ncert_class10_hindi/",
            "ncert_class10_hindi_medium/Chapters/",
            "ncert_class10_hindi_medium/",
            "ncert_class11_physics/",
            "ncert_class11_chemistry/",
            "ncert_class11_math/",
            "ncert_class12_physics/",
            "ncert_class12_chemistry/",
            "ncert_class12_math/",
            ""
    );

    @PostConstruct
    public void init() {
        try {
            if (accessKeyId != null && !accessKeyId.isBlank() && secretAccessKey != null && !secretAccessKey.isBlank()) {
                this.s3Client = S3Client.builder()
                        .endpointOverride(URI.create(endpoint))
                        .credentialsProvider(StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKeyId, secretAccessKey)
                        ))
                        .region(Region.of("auto"))
                        .build();
                log.info("Cloudflare R2 S3Client initialized successfully for bucket '{}'", bucket);
            }
        } catch (Exception e) {
            log.warn("Failed to initialize Cloudflare R2 S3Client: {}", e.getMessage());
        }
    }

    public boolean isConfigured() {
        return s3Client != null;
    }

    public InputStream fetchPdfStream(String fileName) {
        if (s3Client == null || fileName == null || fileName.isBlank()) {
            return null;
        }

        for (String prefix : CANDIDATE_PREFIXES) {
            String fullKey = prefix + fileName;
            try {
                GetObjectRequest getReq = GetObjectRequest.builder()
                        .bucket(bucket)
                        .key(fullKey)
                        .build();
                ResponseInputStream<GetObjectResponse> s3Stream = s3Client.getObject(getReq);
                log.info("Successfully fetched PDF stream from Cloudflare R2: s3://{}/{}", bucket, fullKey);
                return s3Stream;
            } catch (NoSuchKeyException ignored) {
                // Key not found under this prefix, try next
            } catch (Exception e) {
                log.debug("Error checking R2 prefix {}: {}", prefix, e.getMessage());
            }
        }

        log.warn("File '{}' not found in Cloudflare R2 bucket '{}' across all known prefixes", fileName, bucket);
        return null;
    }
}
